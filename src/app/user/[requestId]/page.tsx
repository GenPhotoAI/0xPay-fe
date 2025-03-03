'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from "next/navigation";

import { motion, AnimatePresence } from 'framer-motion';

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { allTokens } from "@/utils/tokenLists";
import { getQuote, getTokenAddress } from '@/utils/helper';
import SelectToken from '@/components/atoms/SelectToken';
import { BACKEND_URL, GATEWAY_FEE } from '@/utils/constants';
import { usePaymentContext } from '@/providers/PaymentContext';
import { useWallet } from '@solana/wallet-adapter-react';

interface Token {
    name: string;
    symbol: string;
    logoURI: string;
}


const page = () => {

    const { publicKey } = useWallet();

    const { paymentData, amount, setPaymentData } = usePaymentContext();

    const [isLoading, setIsLoading] = useState(false);

    const merchantCurrency = paymentData?.merchant?.currency;
    const userSelectedTokenSymbol = paymentData?.userSelectedToken?.symbol;
    const amountToPay = paymentData?.amount;

    console.log(paymentData, "paymentDataaaaa")


    if (!setPaymentData) {
        console.error('setPaymentData is not available in context');
        return null; // or show an error message
    }

    const router = useRouter();
    const isMain = true;
    const className = '';

    const requestId = useParams().requestId;

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);


    const tokens = allTokens;

    const handleProceed = async () => {

        const symbol = selectedToken?.symbol || '';

        if (!selectedToken) {
            throw new Error('Token not selected');
        }
        try {

            // const tokenDetails = await getTokenAddress(symbol);
            // const response = await createPayment(symbol, tokenDetails.address, tokenDetails.decimals, '98.00');

            // if (!response.ok) {
            //     throw new Error('Payment creation failed');
            // }
            setPaymentData({
                ...paymentData,
                userSelectedToken: {
                    name: selectedToken.name,
                    symbol: selectedToken.symbol,
                    logoURI: selectedToken.logoURI
                }
            });


            router.push(`${requestId}/approve`);
        } catch (error) {
            console.error('Error initiating swap:', error);
        }
    };

    const [quoteAmount, setQuoteAmount] = useState(null);
    const [quoteDecimals, setQuoteDecimals] = useState(null);

    useEffect(() => {
        const interval = setInterval(async () => {

            if (!merchantCurrency || !userSelectedTokenSymbol) {
                return;
            }

            setIsLoading(true);

            try {
                const merchantTokenDetails = await getTokenAddress(merchantCurrency);
                const merchantTokenAddress = merchantTokenDetails.address;
                const userTokenDetails = await getTokenAddress(userSelectedTokenSymbol);
                const userTokenAddress = userTokenDetails.address;
                const userTokenDecimals = userTokenDetails.decimals;
                const merchantTokenAmount = amountToPay

                const quoteResponse = await getQuote(userTokenAddress, merchantTokenAddress, merchantTokenAmount.toString());
                console.log(quoteResponse.inAmount, quoteResponse, "quoteResponse")
                setQuoteAmount(quoteResponse.inAmount);
                setQuoteDecimals(userTokenDecimals);
            } catch (error) {
                console.error('Error fetching quote:', error);
            } finally {
                setIsLoading(false);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [userSelectedTokenSymbol, merchantCurrency, amountToPay, selectedToken]);


    const handleTokenSelect = (token: Token) => {
        setSelectedToken(token);
        // Update payment data context when token is selected
        setPaymentData({
            ...paymentData,
            userSelectedToken: {
                name: token.name,
                symbol: token.symbol,
                logoURI: token.logoURI
            }
        });
    };

    return (
        <section
            className={`flex-1 md:p-6 px-3 py-6  h-full bg-cyan-50 rounded-3xl border border-solid border-cyan-400 border-opacity-10 max-md:mb-6 `}
        >
            <header className={`flex justify-between items-center mb-10 `}>
                <h1 className="text-2xl tracking-tighter text-sky-950">0xPay.</h1>
                {/* <CustomConnect /> */}
                <WalletMultiButton
                    style={{
                        borderRadius: '36px',
                        border: '1px solid rgba(232, 251, 255, 0.30)',
                        background: 'linear-gradient(180deg, #48CAE4 0%, #6FE7FF 100%)',
                        boxShadow: '0px 2px 5.2px 0px #6CE5FD',
                        padding: '12px 24px',
                        fontWeight: '500',
                        fontSize: '16px'
                    }}
                />
            </header>
            <main
                className={`mx-auto my-0 max-w-[602px] max-sm:px-4 max-sm:py-0 `}
            >
                <section className="flex justify-between items-center pb-5 mb-6 border-b-2 border-solid border-b-neutral-900 border-b-opacity-10 max-sm:flex-col max-sm:gap-3 max-sm:items-start">
                    <h2 className="mb-2 text-base font-medium text-sky-950">Amount:</h2>
                    <p className="text-4xl font-medium text-sky-950">{`${paymentData?.amount / 10 ** 6} ${merchantCurrency}`}</p>
                </section>

                <div className={`my-4`}>
                    <h3 className="mb-3 text-base font-medium text-slate-900">Pay With:</h3>
                    <button
                        onClick={() => setIsPopupOpen(true)}
                        className="flex justify-between items-center pl-[25px] pr-[5px] py-2 w-full h-14 bg-white border-gray-200 border-solid border-[0.8px] rounded-[30px] max-sm:gap-2 max-sm:h-auto"
                        aria-haspopup="listbox"
                        aria-expanded="false"
                    >
                        <span className="text-sm text-black text-opacity-30">Select Token</span>

                        <span className="px-2 py-2.5 text-sm flex gap-1 items-center cursor-pointer text-black bg-sky-100 rounded-[25px] border border-cyan-50 border-solid">
                            {selectedToken?.logoURI && (
                                <img
                                    src={selectedToken.logoURI}
                                    alt={selectedToken.name}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                />
                            )}
                            {selectedToken?.symbol || 'Select Token'}
                            <motion.svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                animate={{ rotate: isPopupOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-gray-400"
                            >
                                <path
                                    d="M6 9L12 15L18 9"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </motion.svg>
                        </span>
                    </button>

                    <SelectToken
                        isPopupOpen={isPopupOpen}
                        setIsPopupOpen={setIsPopupOpen}
                        tokens={tokens}
                        selectedToken={selectedToken}
                        setSelectedToken={handleTokenSelect}
                    />

                </div>

                {selectedToken && (
                    (!quoteAmount && !quoteDecimals) ? (
                        <div className="h-5 w-64 bg-gradient-to-r from-gray-200 via-white to-gray-200 shimmer-effect rounded"></div>
                    ) : (
                        quoteAmount && quoteDecimals && (
                            <span className="text-sm text-sky-950">
                                {`${quoteAmount / 10 ** quoteDecimals} ${userSelectedTokenSymbol} = ${paymentData?.amount / 10 ** 6} USDC`}
                            </span>
                        )
                    )
                )}

                <section className={`mb-8 mt-4`}>
                    <h3 className="mb-3 text-base font-medium text-slate-900">
                        Fees Calculation
                    </h3>
                    <hr className="mb-3 h-0.5 bg-neutral-900 bg-opacity-10" />
                    <div className={`flex justify-between mb-1`}>
                        <p className="text-sm font-medium text-slate-900">{'Gateway Fees'}</p>
                        <p className="text-sm text-slate-900">{`${GATEWAY_FEE} ${merchantCurrency}`}</p>
                    </div>
                </section>

                {selectedToken && publicKey &&
                    <div className="flex w-full justify-center">
                        <button onClick={handleProceed} type="button"
                            className={`connect_btn cursor-pointer px-6 py-3 font-medium text-[16px] w-[338px]`}
                        >
                            <span className="connect_btn_text">
                                Proceed
                            </span>
                        </button>
                    </div>
                }
            </main>
        </section>
    );
}

export default page