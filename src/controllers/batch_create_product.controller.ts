import {
  BatchWriteItemCommand,
  type BatchWriteItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { getDynamoDBConfig } from "../config";
import type { NextFunction, Request, Response } from "express";
import _ from "lodash";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
dotenv.config();

// DynamoDB client
const client_ddb = getDynamoDBConfig();

// Batch size
const batch_size = Number(process.env.DYNAMODB_BATCH_SIZE!); // DynamoDB supports up to 25 items per request

export const batchCreateProducts = async (req: Request, res: Response, next: NextFunction) => {
  const { input } = req.body;
  const chunks = _.chunk(input, batch_size);
  try {
    for (const chunk of chunks) {
      const insertItems = chunk.map((item: any) => {
        const { name, price, image } = item;
        return {
          PutRequest: {
            Item: {
              PK: { S: nanoid() },
              SK: { S: "products" },
              name: { S: name },
              price: { N: price.toString() },
              ...(image && { image: { S: image } }),
              created_at: { S: new Date().toISOString() },
              updated_at: { S: new Date().toISOString() },
            },
          },
        };
      });

      const params: BatchWriteItemCommandInput = {
        RequestItems: {
          [process.env.TABLE_NAME as string]: insertItems,
        },
      };
      const command = new BatchWriteItemCommand(params);
      const data = await client_ddb.send(command);
      console.log("Item inserted successfully: " + JSON.stringify(data));
    }
    res.send("Batch Item inserted successfully : " + chunks.length);
  } catch (error) {
    console.log("error", error);
    next(error);
    // res.status(500).send(error);
  }
};
