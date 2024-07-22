import winston from "winston";
import path from "path";

// Setup winston for error logging
export const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize()
  ),
  defaultMeta: { service: "crud-app-express-dynamodb" },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(__dirname, "../../error.log"),
    }),
  ],
});
