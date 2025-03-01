'use client'

import React from 'react'
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import BillPanel from "@/components/shared/BillPanel";
import { motion } from 'framer-motion';
import AppWalletProvider from '@/providers/AppWalletProvider';

export default function MerchantLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AppWalletProvider>
            <div className="flex justify-center items-center bg-cyan-100">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex gap-6 p-8 px-[19px] pt-[36px] md:pt-8 w-full max-w-[1311px] min-h-screen lg:flex-row flex-col-reverse justify-center"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.2,
                            type: "spring",
                            bounce: 0.3
                        }}
                        className="lg:flex-1"
                    >
                        {children}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.4,
                            type: "spring",
                            bounce: 0.3
                        }}
                    >
                        <BillPanel />
                    </motion.div>
                </motion.div>
            </div>
        </AppWalletProvider>

    )
}