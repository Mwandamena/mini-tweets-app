import { BaseServiceClient, logger } from "./base.client";
import { Tweet, ServiceResponse } from "../../types/types";

export class TweetServiceClient extends BaseServiceClient {
  constructor() {
    super({
      serviceName: "TweetService",
      baseURL: process.env.TWEET_SERVICE_URL || "http://localhost:3003/api",
      timeout: 5000,
    });
  }

  async getTweetById(tweetId: string): Promise<Tweet | null> {
    try {
      const response = await this.get<ServiceResponse<Tweet>>(
        `/tweets/${tweetId}`
      );
      return response.success ? response.data : null;
    } catch (error: any) {
      logger.error(`Failed to get tweet ${tweetId}:`, error.message);
      return null;
    }
  }

  async getTweetsByIds(tweetIds: string[]): Promise<Map<string, Tweet>> {
    try {
      const response = await this.post<ServiceResponse<Tweet[]>>(
        "/tweets/batch",
        { tweetIds }
      );

      const tweetMap = new Map<string, Tweet>();
      if (response.success) {
        response.data.forEach((tweet) => {
          tweetMap.set(tweet.id, tweet);
        });
      }

      return tweetMap;
    } catch (error: any) {
      logger.error("Failed to get tweets batch:", error.message);
      return new Map();
    }
  }
}
