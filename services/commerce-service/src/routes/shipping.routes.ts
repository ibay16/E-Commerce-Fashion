import { Router } from "express";
import { ShippingController } from "../controllers/shipping.controller";

const router = Router();

router.post("/calculate", async (req, res) => {
  try {
    const result = await ShippingController.calculateShipping(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
