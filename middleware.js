// middleware.js
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/', '/register', '/sign-in', '/sign-up'], // Only public routes listed
  // Do not list '/dashboard' if it's protected!
});

export const config = {
  matcher: [
    // Match all routes except _next and static files
    '/((?!_next|favicon.ico|.*\\..*).*)',
  ],
};
