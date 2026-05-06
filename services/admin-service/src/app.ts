import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import orderRoutes from './routes/order.routes';
import shippingRoutes from './routes/shipping.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'admin-service' });
});

// Modular Routes
// Prefixes based on API Gateway mapping
app.use('/api/admin/management/auth', authRoutes);
app.use('/api/admin/management/orders', orderRoutes);
app.use('/api/admin/management/shipping', shippingRoutes);

export default app;
