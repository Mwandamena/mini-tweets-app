import path from "path";
import logger from "../../config/logger";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../.env") });

export const getEnv = (key: string, defaultValue: string = ""): string => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue) {
      return defaultValue;
    }
    logger.error(`Environment variable ${key} is not set`);
    throw new Error(`Enviroment variable ${key} is not set`);
  }
  return value;
};
