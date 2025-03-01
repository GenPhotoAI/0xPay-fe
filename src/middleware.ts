import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
    matcher: [
        // Only protect merchant.app.com routes
        '/merchant/:path*',
        // Always run for API routes under merchant
        '/merchant/api/:path*',
        '/merchant/trpc/:path*'
    ],
}