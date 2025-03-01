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

  return (
    <>
    </>
  );
}