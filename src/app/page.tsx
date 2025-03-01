'use client'
import CustomConnect from "@/components/atoms/CustomConnect";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import SelectToken from "@/components/atoms/SelectToken";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { createPayment, getTokenAddress } from "@/utils/helper";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { allTokens } from "@/utils/tokenLists";

interface Token {
  name: string;
  symbol: string;
  logoURI: string;
}

export default function Home() {

  const router = useRouter();
  const isMain = true;
  const className = '';

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const tokens = allTokens;

  const handleProceed = async () => {

    const symbol = selectedToken?.symbol || '';

    try {

      const tokenDetails = await getTokenAddress(symbol);
      const response = await createPayment(symbol, tokenDetails.address, tokenDetails.decimals, '98.00');

      if (!response.ok) {
        throw new Error('Payment creation failed');
      }


      const txId = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      router.push(`/approve/${txId}`);
    } catch (error) {
      console.error('Error initiating swap:', error);
    }
  };

  return (
    <section
      className={`flex-1 md:p-6 px-3 py-6  h-full bg-cyan-50 rounded-3xl border border-solid border-cyan-400 border-opacity-10 max-md:mb-6 `}
    >
      <header className={`flex justify-between items-center mb-10 `}>
        <h1 className="text-2xl tracking-tighter text-sky-950">0xPay.</h1>
        {/* <CustomConnect /> */}
        <WalletMultiButton style={{}} />
      </header>
      <main
        className={`mx-auto my-0 max-w-[602px] max-sm:px-4 max-sm:py-0 `}
      >
        <section className="flex justify-between items-center pb-5 mb-6 border-b-2 border-solid border-b-neutral-900 border-b-opacity-10 max-sm:flex-col max-sm:gap-3 max-sm:items-start">
          <h2 className="mb-2 text-base font-medium text-sky-950">Amount:</h2>
          <p className="text-4xl font-medium text-sky-950">$98.00</p>
        </section>

        <div className={`mb-8`}>
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
            setSelectedToken={setSelectedToken}
          />

        </div>
        <section className={`mb-8 `}>
          <h3 className="mb-3 text-base font-medium text-slate-900">
            Fees Calculation
          </h3>
          <hr className="mb-3 h-0.5 bg-neutral-900 bg-opacity-10" />


          <div className={`flex justify-between mb-1`}>
            <p className="text-sm font-medium text-slate-900">{'Exchange Fees'}</p>
            <p className="text-sm text-slate-900">{'$0.8'}</p>
          </div>
          <div className={`flex justify-between mb-1`}>
            <p className="text-sm font-medium text-slate-900">{'Gateway Fees'}</p>
            <p className="text-sm text-slate-900">{'$1.2'}</p>
          </div>
        </section>

        {selectedToken &&
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