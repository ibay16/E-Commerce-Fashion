import { prisma } from '../db/client.js';

export class ShippingService {
  static async getCarriers() {
    let carriers = await prisma.shippingCarrier.findMany({
      where: { isActive: true }
    });

    if (carriers.length === 0) {
      await prisma.shippingCarrier.createMany({
        data: [
          { name: 'JNE', code: 'JNE', baseRate: 10000 },
          { name: 'SiCepat', code: 'SICEPAT', baseRate: 12000 },
          { name: 'Gojek', code: 'GOJEK', baseRate: 15000 },
        ]
      });
      carriers = await prisma.shippingCarrier.findMany({
        where: { isActive: true }
      });
    }
    
    return carriers;
  }

  static async getTracking(orderId: string) {
    return prisma.shippingTracking.findUnique({
      where: { orderId },
      include: {
        carrier: true,
        logs: {
          orderBy: { timestamp: 'desc' }
        }
      }
    });
  }

  static async createTracking(data: { orderId: string, carrierId: string, trackingNumber: string }) {
    const { orderId, carrierId, trackingNumber } = data;
    
    // Create tracking
    const tracking = await prisma.shippingTracking.create({
      data: {
        orderId,
        carrierId,
        trackingNumber,
        status: 'PENDING'
      }
    });

    // Add initial log
    await prisma.shippingLog.create({
      data: {
        shippingTrackingId: tracking.id,
        status: 'PENDING',
        description: 'Tracking initialized'
      }
    });

    // Automatically update order status to SHIPPED
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'SHIPPED' }
    });

    return tracking;
  }

  static async addLog(data: { trackingNumber: string, status: string, location?: string, description?: string }) {
    const { trackingNumber, status, location, description } = data;
    
    const tracking = await prisma.shippingTracking.findUnique({
      where: { trackingNumber }
    });
    
    if (!tracking) throw new Error('Tracking not found');

    const log = await prisma.shippingLog.create({
      data: {
        shippingTrackingId: tracking.id,
        status,
        location,
        description
      }
    });

    await prisma.shippingTracking.update({
      where: { id: tracking.id },
      data: { status }
    });

    if (status === 'DELIVERED') {
      await prisma.order.update({
        where: { id: tracking.orderId },
        data: { status: 'DELIVERED' }
      });
    }

    return log;
  }
}
