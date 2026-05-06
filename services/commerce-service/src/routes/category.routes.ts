import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";

const router = Router();

// Storefront routes
router.get("/", async (req, res) => {
  try {
    const result = await CategoryController.getCategories();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await CategoryController.getCategoryById(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin routes
router.post("/admin", async (req, res) => {
  try {
    const result = await CategoryController.createCategory(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch("/admin/:id", async (req, res) => {
  try {
    const result = await CategoryController.updateCategory(req.params.id, req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/admin/:id", async (req, res) => {
  try {
    const result = await CategoryController.deleteCategory(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
