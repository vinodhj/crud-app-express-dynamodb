import express from "express";
import { createProduct } from "../controllers/create_product.controller.ts";
import { updateProduct } from "../controllers/update_product.controller.ts";
import { product } from "../controllers/product.controller.ts";
import { allProducts } from "../controllers/all_products.controller.ts";
import { deleteProduct } from "../controllers/delete_product.controller.ts";
import { batchCreateProducts } from "../controllers/batch_create_product.controller.ts";
import { batchUpdateProducts } from "../controllers/batch_update_product.controller.ts";

const router = express.Router();

// Routes
router.post("/post-products", createProduct);
router.put("/update-product", updateProduct);
router.get("/product/:pk", product);
router.get("/allProducts", allProducts); // with pagination
router.delete("/delete-product/:pk", deleteProduct);

// Batch operations
router.post("/batch-create-products", batchCreateProducts);
router.put("/batch-update-products", batchUpdateProducts);

export default router;
