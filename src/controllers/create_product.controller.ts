import {
  PutItemCommand,
  type PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { nanoid } from "nanoid";
import { getDynamoDBConfig } from "../config";
import type express from "express";

// DynamoDB client
const client_ddb = getDynamoDBConfig();

export const createProduct = async (
  req: express.Request,
  res: express.Response
) => {
  const { name, price, image } = req.body;
  // Prepare item data for DynamoDB
  const params: PutItemCommandInput = {
    TableName: process.env.TABLE_NAME as string,
    Item: {
      PK: { S: nanoid() },
      SK: { S: new Date().toISOString() },
      name: { S: name },
      price: { N: price.toString() },
      ...(image && { image: { S: image } }),
    },
  };
  try {
    // Insert into DynamoDB
    const data = await client_ddb.send(new PutItemCommand(params));
    res.send("Item created successfully: " + JSON.stringify(data));
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error);
  }
};
