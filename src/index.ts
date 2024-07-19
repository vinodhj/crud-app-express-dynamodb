import express from "express";
import { getDynamoDBConfig } from "./config";
import { nanoid } from "nanoid";
import {
  PutItemCommand,
  type PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";

const app = express();
const port = 3002;

// middleware
app.use(express.json());

// DynamoDB client
const client_ddb = getDynamoDBConfig();
//console.log("client_ddb", client_ddb);

app.get("/", (req, res) => {
  //console.log("req", req);
  res.send("Hello World!");
});

app.post<{ body: { name: string; price: number; image?: string } }>(
  "/api/post-products",
  async (req, res) => {
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
    console.log("params", params);
    try {
      // Insert into DynamoDB
      const data = await client_ddb.send(new PutItemCommand(params));
      console.log("Success:", data);
      res.send("Item created successfully: " + JSON.stringify(data));
    } catch (error) {
      console.log("error", error);
      res.status(500).send(error);
    }
  }
);

app.listen(port, () => {
  console.log(` Server app listening at http://localhost:${port}`);
});

export default app;
