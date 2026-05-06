import { Router } from "express";
import { HealthController } from "../controllers/health.controller";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await HealthController.checkHealth();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
