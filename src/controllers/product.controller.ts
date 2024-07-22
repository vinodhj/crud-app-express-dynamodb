import {
  GetItemCommand,
  type GetItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { getDynamoDBConfig } from "../config";
import type { NextFunction, Request, Response } from "express";

// DynamoDB client
const client_ddb = getDynamoDBConfig();

export const product = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pk } = req.params;
  // Prepare item data for DynamoDB
  const params: GetItemCommandInput = {
    Key: {
      PK: { S: pk },
      SK: { S: "products" },
    },
    TableName: process.env.TABLE_NAME as string,
  };
  try {
    // Insert into DynamoDB
    const command = new GetItemCommand(params);
    const data = await client_ddb.send(command);
    if (!data.Item) {
      const error = new Error("Item not found", {
        cause: { status: 404, message: "Item not found" },
      });
      next(error);
    }
    res.json({
      message: "success",
      Items: data.Item,
    });
    // res.send();
  } catch (error) {
    console.log("error", error);
    next(error);
    // res.status(500).send(error);
  }
};
