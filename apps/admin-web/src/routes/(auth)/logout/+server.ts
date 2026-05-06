import { handleLogout } from '$lib/auth/session';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
  return handleLogout(cookies);
};

export const POST: RequestHandler = async ({ cookies }) => {
  return handleLogout(cookies);
};
