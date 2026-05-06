import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import reviewRoutes from "./routes/review.routes";
import shippingRoutes from "./routes/shipping.routes";
import analyticsRoutes from "./routes/analytics.routes";
import healthRoutes from "./routes/health.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "commerce-service" });
});

// For storefront BFF (via Gateway)
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/shipping", shippingRoutes);

// For admin BFF (via Gateway)
app.use("/api/admin/products", productRoutes);
app.use("/api/admin/categories", categoryRoutes);
app.use("/api/admin/analytics", analyticsRoutes);

app.use("/api/health", healthRoutes);

export default app;
