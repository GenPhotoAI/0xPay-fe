'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation';
import CustomConnect from '@/components/atoms/CustomConnect';
import { motion } from 'framer-motion';
import { usePaymentContext } from '@/providers/PaymentContext';
import { getQuote, getTokenAddress } from "@/utils/helper";
import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';



const page = () => {

    const router = useRouter();
    const { paymentData, amount } = usePaymentContext();

    const amountToPay = paymentData.amount;

    const merchantAddress = paymentData?.merchant?.address;
    const merchantCurrency = paymentData?.merchant?.currency;

    const { requestId } = useParams();

    const userSelectedToken = paymentData?.userSelectedToken;

    if (!userSelectedToken) {
        router.push(`/user/${requestId}`);
    }

    const userSelectedTokenName = userSelectedToken?.name;
    const userSelectedTokenSymbol = userSelectedToken?.symbol;
    const userSelectedTokenLogoURI = userSelectedToken?.logoURI;

    const { publicKey, wallet, signTransaction } = useWallet();

    console.log(publicKey, "publicKey")

    const { txId } = useParams();

    const [currentStep, setCurrentStep] = useState(0);
    const steps = ['Initiate', 'Approve', 'Confirm'];

    const handleNextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
        }
    }

    const handleProceed = async () => {

        if (!merchantCurrency || !userSelectedTokenSymbol) {
            return;
        }

        try {
            // const merchantTokenAddress = merchant?.tokenAddress;// get it form the data of the requestId
            // const merchantTokenDecimals = merchant?.tokenAmount; // get it form the data of the requestId
            const merchantTokenDetails = await getTokenAddress(merchantCurrency); // data user  - merchant.currency
            const merchantTokenAddress = merchantTokenDetails.address;
            const userTokenDetails = await getTokenAddress(userSelectedTokenSymbol); // user selected symbol
            const userTokenAddress = userTokenDetails.address;
            const userTokenDecimals = userTokenDetails.decimals; //inputTokenDecimals to BE
            const connection = new Connection("https://mainnet.helius-rpc.com/?api-key=f6afcd4f-5aa6-4a78-9d1a-d64d6720352f"); // env me daldo
            const merchantTokenAmount = amountToPay // data user  - data.amount
            const USDC_MINT = new PublicKey(merchantTokenAddress); // Yget from the data of the requestId
            const merchantAccount = new PublicKey(merchantAddress); // get from the data of the requestId - enter the address

            const merchantUSDCTokenAccount = await getAssociatedTokenAddress(
                USDC_MINT,
                merchantAccount,
                true,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            );

            console.log("merchantUSDCTokenAccount:", merchantUSDCTokenAccount.toBase58());


            const quoteResponse = await getQuote(userTokenAddress, merchantTokenAddress, merchantTokenAmount.toString());

            console.log(quoteResponse)

            const swapResponse = await (
                await fetch('https://api.jup.ag/swap/v1/swap', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'x-api-key': '' // enter api key here
                    },
                    body: JSON.stringify({
                        quoteResponse,
                        userPublicKey: publicKey?.toString(),
                        destinationTokenAccount: merchantUSDCTokenAccount.toBase58(),

                    })
                })
            ).json();

            console.log(swapResponse, "swapResponse")

            const transactionBase64 = swapResponse.swapTransaction
            const transaction = VersionedTransaction.deserialize(Buffer.from(transactionBase64, 'base64'));

            if (!signTransaction) throw new Error('Wallet does not support transaction signing');
            const signedTransaction = await signTransaction(transaction);

            const transactionBinary = signedTransaction.serialize();

            console.log(signedTransaction, "signedTransaction", transactionBinary)

            const signature = await connection.sendRawTransaction(transactionBinary, {
                maxRetries: 10,
                preflightCommitment: "finalized",
            });

            const confirmation = await connection.confirmTransaction(signature, "finalized");
            console.log(confirmation, "confirmation")
            // const response = await createPayment(symbol, tokenDetails.address, tokenDetails.decimals, '98.00');// take this amount from 

            // console.log(response, "response", tokenDetails);

            // if (!response.ok) {
            //   throw new Error('Payment creation failed');
            // }


            // const txId = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            // router.push(`/approve/${txId}`);
        } catch (error) {
            console.error('Error initiating swap:', error);
        }
    };


    console.log(paymentData, "paymentData on approve page")
    return (
        <section
            className={`flex-1 p-6 h-full bg-cyan-50 rounded-3xl border border-solid border-cyan-400 border-opacity-10 max-md:mb-6 `}
        >
            <header className={`flex justify-between items-center mb-10 `}>
                <h1 className="text-2xl tracking-tighter text-sky-950">0xPay.</h1>
                {/* <CustomConnect /> */}
            </header>
            <main className={`mx-auto flex flex-col my-0 max-w-[602px] max-sm:px-4 max-sm:py-0 `}>
                <div className="flex flex-col gap-[25px]">
                    <div className="steps flex w-full gap-[6px] ">
                        {steps.map((step, index) => (
                            <div key={step} className="flex-1">
                                <motion.div
                                    className="h-[5px] bg-[#1AC1E3] bg-opacity-20 flex-1 rounded-[17px] overflow-hidden"
                                >
                                    <motion.div
                                        className="h-full bg-[#1AC1E3] bg-opacity-100"
                                        initial={{ width: "0%" }}
                                        animate={{
                                            width: currentStep > index ? "100%" : "0%",
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            ease: "easeInOut",
                                            delay: index * 0.2
                                        }}
                                    />
                                </motion.div>
                            </div>
                        ))}

                    </div>

                    <section className="flex justify-between items-center pb-5 mb-6 max-sm:flex-col max-sm:gap-3 max-sm:items-start">
                        <h2 className="mb-2 text-base font-medium text-sky-950">Amount:</h2>
                        <p className="text-4xl font-medium text-sky-950">{`$${paymentData?.amount / 10 ** 6}`}</p>
                    </section>

                    <button className="text-[#0096C7] cursor-pointer w-full py-3 bg-[#CAF0F8] bg-opacity-[40%] rounded-[12px] 
                    transition-all duration-200 ease-in-out font-medium text-[16px]
                    hover:bg-opacity-60 hover:shadow-lg hover:shadow-[#CAF0F8]/20
                    active:transform active:scale-[0.98] active:bg-opacity-70
                    focus:outline-none focus:ring-2 focus:ring-[#0096C7]/20"
                        onClick={handleProceed}>das
                        Approve Transaction From Wallet
                    </button>
                </div>

                <div className="or-strip flex gap-[3px] my-6 justify-center items-center">
                    <div className="flex-1 h-[2px] bg-[#00000033]"></div>
                    <div className="text-[16px] text-[#00000033]">Or</div>
                    <div className="flex-1 h-[2px] bg-[#00000033]"></div>
                </div>

                <div className="">
                    <button className="py-3 w-full justify-center font-medium items-center text-[#0096C7] text-[16px]">
                        Approve Transaction From Wallet
                    </button>
                </div>

                <div className=""></div>

            </main>
        </section>
    )
}

export default page