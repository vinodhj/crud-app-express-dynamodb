import express, { type Response, type Request } from "express";
import productRoute from "./routes/product.route";
import morgan from "morgan";
import { accessLogStream } from "./accessLogStream";

const app = express();
const port = 3002;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("combined", { stream: accessLogStream }));

// Routes
app.use("/api", productRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Crud App is running!");
});

app.listen(port, () => {
  console.log(`Server app listening at http://localhost:${port}`);
});

export default app;
