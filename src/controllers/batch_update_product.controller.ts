import {
  TransactWriteItemsCommand,
  type TransactWriteItemsCommandInput,
} from "@aws-sdk/client-dynamodb";
import { getDynamoDBConfig } from "../config";
import type { NextFunction, Request, Response } from "express";
import _ from "lodash";
import dotenv from "dotenv";
dotenv.config();

// DynamoDB client
const client_ddb = getDynamoDBConfig();

// Batch size
const batch_size = Number(process.env.DYNAMODB_BATCH_SIZE!); // DynamoDB supports up to 25 items per request

export const batchUpdateProducts = async (req: Request, res: Response, next: NextFunction) => {
  const { input } = req.body;
  const chunks = _.chunk(input, batch_size);
  try {
    for (const chunk of chunks) {
      const updateItems = chunk.map((item: any) => {
        const { pk, name, price, image } = item;
        return {
          Update: {
            ExpressionAttributeNames: {
              "#NAME": "name",
              "#PRICE": "price",
              "#UPDATED_AT": "updated_at",
              ...(image && { "#IMAGE": "image" }),
            },
            ExpressionAttributeValues: {
              ":name": { S: name },
              ":price": { N: price.toString() },
              ":updated_at": { S: new Date().toISOString() },
              ...(image && { ":image": { S: image } }),
            },
            Key: {
              PK: { S: pk },
              SK: { S: "products" },
            },
            ReturnValues: "UPDATED_NEW",
            TableName: process.env.TABLE_NAME as string,
            ...(image && {
              UpdateExpression:
                "SET #NAME = :name, #PRICE = :price, #IMAGE = :image, #UPDATED_AT = :updated_at",
            }),
            ...(!image && {
              UpdateExpression:
                "SET #NAME = :name, #PRICE = :price, #UPDATED_AT = :updated_at",
            }),
          },
        };
      });

      const params: TransactWriteItemsCommandInput = {
        TransactItems: updateItems,
      };
      const command = new TransactWriteItemsCommand(params);
      const data = await client_ddb.send(command);
      console.log("Item updated successfully: " + JSON.stringify(data));
    }
    res.send("Batch Item updated successfully : " + chunks.length);
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};
