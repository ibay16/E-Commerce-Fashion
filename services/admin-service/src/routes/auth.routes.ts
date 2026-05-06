import { Router } from "express";
import { AdminAuthController } from "../controllers/auth.controller";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AdminAuthController.login({ email, password });
    
    // Set cookie if needed, but Gateway usually handles this.
    // However, for the service itself, we just return the result.
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
});

router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const result = await AdminAuthController.getMe(token);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
});

router.post("/logout", async (req, res) => {
  try {
    // Adapter for the controller's expectation of a cookies object with delete method
    const cookiesAdapter = {
      delete: (name: string, options: any) => {
        res.clearCookie(name, options);
      }
    };
    const result = await AdminAuthController.logout(cookiesAdapter);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
