import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { OrderStatus } from "@novure/database";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const result = await OrderController.getOrders({
      status: status as OrderStatus
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
