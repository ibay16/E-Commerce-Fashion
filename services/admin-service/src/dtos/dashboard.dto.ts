export interface DashboardOverviewDTO {
  analytics: {
    summary: {
      totalRevenue: number;
      revenueGrowth: number;
    };
    finance: {
      grossProfit: number;
    };
    successRate: number;
  };
  recentOrders: any[];
}
