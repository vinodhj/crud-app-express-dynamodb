import express from "express";
import { createProduct } from "../controllers/create_product.controller.ts";

const router = express.Router();

// create a product
router.post("/post-products", createProduct);

export default router;
