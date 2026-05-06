import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const result = await ReviewController.submitReview(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
