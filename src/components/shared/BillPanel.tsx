import { usePaymentContext } from "@/providers/PaymentContext";
import { GATEWAY_FEE } from "@/utils/constants";
import React from "react";

export default function BillPanel() {

    const { paymentData, amount } = usePaymentContext();

    const showLabel = true;
    const labelText = 'Amount';
    const className = '';

    return (
        <div className="w-full flex justify-center items-center">
            <aside className={`w-[380px] flex flex-col lg:items-start items-center lg:text-start text-center`}>
                <button
                    className={`flex gap-3 w-fit items-center px-3 py-2 rounded-xl border border-solid bg-white bg-opacity-30 border-sky-50 border-opacity-40 shadow-[inset_0_0_4px_rgba(255,255,255,0.25)] ${className}`}
                >
                    <span className="flex justify-center items-center px-px pt-1.5 pb-1.5 w-6 h-6 bg-white rounded-full border-2 border-white border-solid">
                        <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/5f5b9f90c46f8c87343c93e24718342379bd4ef3"
                            alt="Egg icon"
                            className="h-[11px] w-[22px]"
                        />
                    </span>
                    <span className="text-sm font-medium text-sky-950">New Egg</span>
                </button>
                <section className={'w-full py-3 lg:py-0'}>
                    {showLabel && (
                        <h2 className="mb-2 text-base lg:text-start text-center font-medium text-sky-950">{labelText}</h2>
                    )}
                    <p className="text-4xl font-medium text-sky-950">
                        {`$${paymentData?.amount / 10 ** 6}`}
                    </p>
                </section>

                <section className={'mt-6 w-full'}>
                    <div className={`flex justify-between mb-2 ${className}`}>
                        <p className="text-sm text-sky-950">{'Gateway Fees'}</p>
                        <p className="text-sm text-sky-950">{`${GATEWAY_FEE}`}</p>
                    </div>
                </section>
            </aside>
        </div>

    )
}
