import express from "express";
import { createProduct } from "../controllers/create_product.controller.ts";
import { updateProduct } from "../controllers/update_product.controller.ts";

const router = express.Router();

// create a product
router.post("/post-products", createProduct);

router.put("/update-product", updateProduct);

export default router;
