'use client'
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import SelectToken from "@/components/atoms/SelectToken";
import { useRouter } from "next/navigation";
import { getQuote, getTokenAddress } from "@/utils/helper";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { allTokens } from "@/utils/tokenLists";
import { EXCHANGE_FEE, GATEWAY_FEE } from "@/utils/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";

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
  const { publicKey, wallet, signTransaction } = useWallet();

  const tokens = allTokens;

  const handleProceed = async () => {

    const symbol = selectedToken?.symbol || '';

    try {
      // const merchantTokenAddress = merchant?.tokenAddress;// get it form the data of the requestId
      // const merchantTokenDecimals = merchant?.tokenAmount; // get it form the data of the requestId
      const merchantTokenAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
      const merchantAddress= "5MNEQfHb5MxJhvJv41FD1YSrVTVh1HiWYZWzNhpR4j1"
      const connection = new Connection("https://mainnet.helius-rpc.com/?api-key=f6afcd4f-5aa6-4a78-9d1a-d64d6720352f");
      const merchantTokenAmount = "10000"
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


      const tokenDetails = await getTokenAddress("SOL");
      const quoteResponse = await getQuote((tokenDetails as any).address as string, merchantTokenAddress, merchantTokenAmount);

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
      
    const confirmation = await connection.confirmTransaction( signature , "finalized");
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

          {/* 
          <div className={`flex justify-between mb-1`}>
            <p className="text-sm font-medium text-slate-900">{'Exchange Fees'}</p>
            <p className="text-sm text-slate-900">{`${EXCHANGE_FEE * 100}%`}</p>
          </div> */}
          <div className={`flex justify-between mb-1`}>
            <p className="text-sm font-medium text-slate-900">{'Gateway Fees'}</p>
            <p className="text-sm text-slate-900">{`${GATEWAY_FEE * 100}%`}</p>
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