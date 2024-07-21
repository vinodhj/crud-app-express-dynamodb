import {
  UpdateItemCommand,
  type UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { getDynamoDBConfig } from "../config";
import type { Request, Response } from "express";

// DynamoDB client
const client_ddb = getDynamoDBConfig();

export const updateProduct = async (req: Request, res: Response) => {
  const { pk, name, price, image } = req.body;
  // Prepare item data for DynamoDB
  const params: UpdateItemCommandInput = {
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
  };
  //console.log(params);
  try {
    // Insert into DynamoDB
    const command = new UpdateItemCommand(params);
    const data = await client_ddb.send(command);
    res.send("Item updated successfully: " + JSON.stringify(data));
    // res.send();
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error);
  }
};
