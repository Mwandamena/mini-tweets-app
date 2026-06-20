import { getLogger, type LoggerType } from "@mta/logger";

const SERVICE_NAME = "mta-metrics-service";

export const logger: LoggerType = getLogger(SERVICE_NAME, "debug");
