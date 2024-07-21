import {
  ScanCommand,
  type ScanCommandInput,
} from "@aws-sdk/client-dynamodb";
import { getDynamoDBConfig } from "../config";
import type { Request, Response } from "express";

// DynamoDB client
const client_ddb = getDynamoDBConfig();

export const allProducts = async (req: Request, res: Response) => {
  // Prepare items data for DynamoDB
  const params: ScanCommandInput = {
    TableName: process.env.TABLE_NAME as string,
  };
  //console.log(params);
  try {
    // Insert into DynamoDB
    const command = new ScanCommand(params);
    const data = await client_ddb.send(command);
    console.log(JSON.stringify(data));
    if (!data.Items) return res.status(404).send("Item not found");
    res.send("Item fetched successfully: " + JSON.stringify(data.Items));
    // res.send();
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error);
  }
};
