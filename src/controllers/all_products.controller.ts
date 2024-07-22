import { QueryCommand, type QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { getDynamoDBConfig } from "../config";
import type { NextFunction, Request, Response } from "express";

// DynamoDB client
const client_ddb = getDynamoDBConfig();

export const allProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Pagination parameters
  const {
    limit: limitStr,
    startKey,
    pk,
    updated_at,
    sortDirection,
  } = req.query;
  let startKeyStr;
  if (startKey) {
    startKeyStr = {
      PK: { S: pk as string },
      SK: { S: "products" },
      updated_at: { S: updated_at as string },
    };
  }
  const limit = limitStr ? Number(limitStr) : 10;
  const params: QueryCommandInput = {
    TableName: process.env.TABLE_NAME! as string,
    IndexName: "SK-updated_at-index",
    KeyConditionExpression: "SK = :sk",
    ExpressionAttributeValues: {
      ":sk": { S: "products" },
    },
    Limit: limit,
    ExclusiveStartKey: startKey ? startKeyStr : undefined,
    ScanIndexForward: sortDirection === "asc" ? true : false,
  };

  try {
    const command = new QueryCommand(params);
    const data = await client_ddb.send(command);
    res.json({
      items: data.Items || [],
      lastEvaluatedKey: data.LastEvaluatedKey,
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};
