import {
  DeleteItemCommand,
  type DeleteItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { getDynamoDBConfig } from "../config";
import type { NextFunction, Request, Response } from "express";

// DynamoDB client
const client_ddb = getDynamoDBConfig();

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { pk } = req.params;
  // Prepare item data for DynamoDB
  const params: DeleteItemCommandInput = {
    Key: {
      PK: { S: pk },
      SK: { S: "products" },
    },
    TableName: process.env.TABLE_NAME as string,
  };
  try {
    // Insert into DynamoDB
    const command = new DeleteItemCommand(params);
    const data = await client_ddb.send(command);
    res.send("deleted successfully: " + JSON.stringify(data));
  } catch (error) {
    console.log("error", error);
    next(error);
    // res.status(500).send(error);
  }
};
