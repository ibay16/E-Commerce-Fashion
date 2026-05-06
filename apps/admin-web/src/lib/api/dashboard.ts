import { API_BASE_URL, INTERNAL_API_URL } from './config';

export class DashboardAPI {
  private static async safeFetch(fetch: any, url: string) {
    try {
      const res = await fetch(url);
      if (!res.ok) return { data: null, error: `Fetch failed: ${res.status}` };
      return await res.json();
    } catch (e: any) {
      console.error(`[DashboardAPI] Error fetching ${url}:`, e.message);
      return { data: null, error: e.message };
    }
  }

  static async getOverview(fetch: any) {
    const [analytics, orders] = await Promise.all([
      this.safeFetch(fetch, `${API_BASE_URL}/analytics`),
      this.safeFetch(fetch, `${API_BASE_URL}/orders?limit=5`)
    ]);

    return {
      analytics: analytics.data || {
        summary: { totalRevenue: 0, revenueGrowth: 0 },
        finance: { grossProfit: 0 },
        successRate: 100
      },
      recentOrders: (orders.data || []).slice(0, 5)
    };
  }

  static async getProducts(fetch: any, query = '', category = '') {
    let url = `${API_BASE_URL}?q=${query}`;
    if (category) url += `&category=${category}`;
    return this.safeFetch(fetch, url);
  }

  static async getOrders(fetch: any) {
    return this.safeFetch(fetch, `${API_BASE_URL}/orders`);
  }
}
