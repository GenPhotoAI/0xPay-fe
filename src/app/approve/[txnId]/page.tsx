'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import CustomConnect from '@/components/atoms/CustomConnect';
import { motion } from 'framer-motion';

const page = () => {

    const { txId } = useParams();

    const [currentStep, setCurrentStep] = useState(0);
    const steps = ['Initiate', 'Approve', 'Confirm'];

    const handleNextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
        }
    }

    return (
        <section
            className={`flex-1 p-6 h-full bg-cyan-50 rounded-3xl border border-solid border-cyan-400 border-opacity-10 max-md:mb-6 `}
        >
            <header className={`flex justify-between items-center mb-10 `}>
                <h1 className="text-2xl tracking-tighter text-sky-950">0xPay.</h1>
                <CustomConnect />
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
                        <p className="text-4xl font-medium text-sky-950">$98.00</p>
                    </section>

                    <button className="text-[#0096C7] cursor-pointer w-full py-3 bg-[#CAF0F8] bg-opacity-[40%] rounded-[12px] 
                    transition-all duration-200 ease-in-out font-medium text-[16px]
                    hover:bg-opacity-60 hover:shadow-lg hover:shadow-[#CAF0F8]/20
                    active:transform active:scale-[0.98] active:bg-opacity-70
                    focus:outline-none focus:ring-2 focus:ring-[#0096C7]/20"
                        onClick={handleNextStep}>
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