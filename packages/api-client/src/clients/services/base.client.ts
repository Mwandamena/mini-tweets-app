import { getLogger } from "@mta/logger";
import axios, { AxiosInstance, AxiosError } from "axios";
import Redis from "ioredis";

interface CacheConfig {
  enabled: boolean;
  ttl: number;
  redis?: Redis;
}

interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
}

interface ServiceClientOptions {
  serviceName: string;
  baseURL: string;
  timeout?: number;
  cache?: CacheConfig;
  retry?: RetryConfig;
}

export const logger: any = getLogger("Service-API-client", "info");

export abstract class BaseServiceClient {
  protected client: AxiosInstance;
  protected serviceName: string;
  protected cache?: CacheConfig;
  protected retry: RetryConfig;

  constructor(options: ServiceClientOptions) {
    this.serviceName = options.serviceName;
    this.cache = options.cache;
    this.retry = options.retry || { maxRetries: 3, retryDelay: 1000 };

    this.client = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeout || 10000,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.INTERNAL_API_KEY || "",
        "X-Service-Name": options.serviceName,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const timestamp = new Date().toISOString();
        logger.info(
          `[${timestamp}] ${this.serviceName} → ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        logger.error(`[${this.serviceName}] Request error:`, error.message);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.info(
          `[${this.serviceName}] ✓ Response received from ${response.config.url}`
        );
        return response;
      },
      async (error: AxiosError) => {
        const config = error.config as any;

        if (config && !config.__retryCount) {
          config.__retryCount = 0;
        }

        const shouldRetry =
          config.__retryCount < this.retry.maxRetries &&
          this.isRetryableError(error);

        if (shouldRetry) {
          config.__retryCount += 1;
          logger.warn(
            `[${this.serviceName}] Retry ${config.__retryCount}/${this.retry.maxRetries} for ${config.url}`
          );

          await this.delay(this.retry.retryDelay * config.__retryCount);
          return this.client.request(config);
        }

        logger.error(`[${this.serviceName}] ✗ Error:`, {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
        });

        return Promise.reject(error);
      }
    );
  }

  private isRetryableError(error: AxiosError): boolean {
    if (!error.response) return true;
    const status = error.response.status;
    return status >= 500 && status <= 599;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  protected async getCached<T>(key: string): Promise<T | null> {
    if (!this.cache?.enabled || !this.cache.redis) return null;

    try {
      const cached = await this.cache.redis.get(key);
      if (cached) {
        logger.info(`[${this.serviceName}] Cache HIT: ${key}`);
        return JSON.parse(cached);
      }
      logger.info(`[${this.serviceName}] Cache MISS: ${key}`);
    } catch (error) {
      logger.error(`[${this.serviceName}] Cache error:`, error);
    }
    return null;
  }

  protected async setCached<T>(key: string, value: T): Promise<void> {
    if (!this.cache?.enabled || !this.cache.redis) return;

    try {
      await this.cache.redis.setex(key, this.cache.ttl, JSON.stringify(value));
      logger.info(`[${this.serviceName}] Cached: ${key}`);
    } catch (error) {
      logger.error(`[${this.serviceName}] Cache set error:`, error);
    }
  }

  protected async invalidateCache(pattern: string): Promise<void> {
    if (!this.cache?.enabled || !this.cache.redis) return;

    try {
      const keys = await this.cache.redis.keys(pattern);
      if (keys.length > 0) {
        await this.cache.redis.del(...keys);
        logger.info(`[${this.serviceName}] Invalidated cache: ${pattern}`);
      }
    } catch (error) {
      logger.error(`[${this.serviceName}] Cache invalidation error:`, error);
    }
  }

  protected async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  protected async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  protected async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  protected async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data);
    return response.data;
  }

  protected async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}
