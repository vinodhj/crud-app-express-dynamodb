import express, {
  type Response,
  type Request,
  type NextFunction,
} from "express";
import productRoute from "./routes/product.route";
import morgan from "morgan";
import { accessLogStream } from "./streamLogs/accessLogStream";
import { logger } from "./streamLogs/logger";

const app = express();
const port = 3002;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("combined", { stream: accessLogStream }));

// Routes
app.use("/api", productRoute);

app.get("/", (_req: Request, res: Response) => {
  res.send("Crud App is running!");
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  const status = (err as any).cause?.status || 500;
  logger.error({
    ...err,
    method: req.method,
    url: req.url,
    status,
  });
  res.status(status).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server app listening at http://localhost:${port}`);
});

export default app;
