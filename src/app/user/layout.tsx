'use client'

import React, { useEffect, useState } from 'react'
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import BillPanel from "@/components/shared/BillPanel";
import { motion } from 'framer-motion';
import AppWalletProvider from '@/providers/AppWalletProvider';
import { BACKEND_URL } from '@/utils/constants';
import { useRouter, useParams } from "next/navigation";
import { PaymentContext } from '@/providers/PaymentContext';

export default function MerchantLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const requestId = useParams().requestId;
    const [paymentData, setPaymentData] = useState<any>(null);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        const fetchRequestDetails = async () => {
            const response = await fetch(`${BACKEND_URL}/user/status/${requestId}`);
            const data = await response.json();
            console.log("data user", data);

            setPaymentData(data);

            const amt = data.amount;
            setAmount(amt);
        }
        fetchRequestDetails();
    }, [requestId]);

    return (
        <AppWalletProvider>
            <PaymentContext.Provider value={{ paymentData, amount, setPaymentData }}>
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
            </PaymentContext.Provider>

        </AppWalletProvider>

    )
}