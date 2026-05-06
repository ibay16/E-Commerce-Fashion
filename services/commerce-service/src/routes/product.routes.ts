import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { ReviewController } from "../controllers/review.controller";

const router = Router();

/**
 * Storefront Routes
 */
router.get("/", ProductController.getProducts);
router.get("/:id", ProductController.getProductById);
router.get("/:id/reviews", ReviewController.getReviewsByProductId);

/**
 * Admin Routes
 */
router.get("/admin", ProductController.getAdminProducts);
router.get("/admin/:id", ProductController.getAdminProductById);
router.patch("/admin/:id", ProductController.updateProduct);
router.delete("/admin/:id", ProductController.deleteProduct);

export default router;
