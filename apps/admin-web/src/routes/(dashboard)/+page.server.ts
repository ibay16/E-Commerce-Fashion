import { DashboardAPI } from '$lib/api/dashboard';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  return await DashboardAPI.getOverview(fetch);
};
