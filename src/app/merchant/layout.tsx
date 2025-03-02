import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <div className="w-full min-h-screen bg-[#CAF0F8] text-black">
                {children}
            </div>
        </ClerkProvider>
    )
}