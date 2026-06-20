import winston from "winston";
import type { Logger } from "winston";

export interface LoggerType extends Logger {}

export const getLogger = (service: string, level = "debug"): LoggerType => {
  return winston.createLogger({
    level: level,
    defaultMeta: { service },
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(({ level, message, timestamp, service }) => {
        return `${timestamp} ${level} [${service}]: ${message}`;
      }),
    ),
    transports: [new winston.transports.Console()],
  });
};
