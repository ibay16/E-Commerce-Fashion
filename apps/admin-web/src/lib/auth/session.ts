import { redirect } from '@sveltejs/kit';

export const handleLogout = async (cookies: any) => {
  cookies.delete('novure_jwt', { path: '/' });
  throw redirect(303, '/login');
};
