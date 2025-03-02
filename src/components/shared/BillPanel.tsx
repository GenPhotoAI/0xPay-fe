import { usePaymentContext } from "@/providers/PaymentContext";
import { GATEWAY_FEE } from "@/utils/constants";
import React from "react";
import profile from '@/assets/profile.svg';
import Image from "next/image";

export default function BillPanel() {

    const { paymentData, amount } = usePaymentContext();

    const merchantCurrency = paymentData?.merchant?.currency;

    const showLabel = true;
    const labelText = 'Amount';
    const className = '';

    return (
        <div className="w-full flex justify-center items-center">
            <aside className={`w-[380px] flex flex-col lg:items-start items-center lg:text-start text-center`}>

                <button className={`flex gap-3 w-fit items-center px-3 py-2 profileTag rounded-[12px] ${className}`}>
                    <div className="bg-white rounded-full p-[5px]">
                        <Image
                            src={profile}
                            alt="Egg icon"
                            className="h-[24px] w-[24px]"
                        />
                    </div>
                    <span className="text-sm font-medium text-sky-950">{paymentData?.merchant?.name}</span>
                </button>

                <section className={'w-full py-3 lg:py-0 mt-6'}>
                    {showLabel && (
                        <h2 className="mb-2 text-base lg:text-start text-center font-medium text-sky-950">{labelText}</h2>
                    )}
                    <p className="text-4xl font-medium text-sky-950">
                        {`${paymentData?.amount / 10 ** 6} ${merchantCurrency}`}
                    </p>
                </section>

                <section className={'mt-6 w-full'}>
                    <div className={`flex justify-between mb-2 ${className}`}>
                        <p className="text-sm text-sky-950">{'Gateway Fees'}</p>
                        <p className="text-sm text-sky-950">{`$${GATEWAY_FEE}`}</p>
                    </div>
                </section>
            </aside>
        </div >

    )
}
