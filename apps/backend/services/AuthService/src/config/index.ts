interface Config {
  SERVICE_NAME: string;
  PORT: number;
  DATABASE_URL: string;
  REDIS_URL: string;
  KAFKA_BROKER: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  LOG_LEVEL: string;
  ALLOWED_ORIGINS: string;
}

export const config: Config = {
  SERVICE_NAME: require("../../package.json").name,
  PORT: Number(process.env.PORT) || 3001,
  DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost:27017/auth",
  REDIS_URL: process.env.REDIS_URL || "redis://:admin:6379",
  KAFKA_BROKER: process.env.KAFKA_BROKER || "kafka:9093",
  JWT_SECRET: process.env.JWT_SECRET || "your-default-secret-key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "localhost:5173",
};
