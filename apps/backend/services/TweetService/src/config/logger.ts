import { getLogger } from "@mta/logger";

export const logger = getLogger(
  process.env.SERVICE_NAME || "tweet-service",
  "debug"
);
