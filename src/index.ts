import express, { type Response, type Request } from "express";
import productRoute from "./routes/product.route";

const app = express();
const port = 3002;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api", productRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Crud App is running!");
});

app.listen(port, () => {
  console.log(`Server app listening at http://localhost:${port}`);
});

export default app;
