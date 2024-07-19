import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromSSO } from "@aws-sdk/credential-providers";
import dotenv from "dotenv";
dotenv.config();

export const getDynamoDBConfig = () => {
  return new DynamoDBClient({
    region: process.env.REGION!,
    credentials: fromSSO({ profile: process.env.AWS_PROFILE! }),
  });
};
