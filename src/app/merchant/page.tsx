'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import googleIcon from '@/assets/googleIcon.svg'
import Image from 'next/image';
import { getMerchant } from '@/utils/helper';
const Page = () => {

    const { userId, getToken } = useAuth()

    const [showMerchantForm, setShowMerchantForm] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        solAddress: ''
    });

    const router = useRouter();
    const { isSignedIn, isLoaded } = useAuth();

    const getMerchantDetails = async () => {
        const token = await getToken();
        console.log('token', token);
        if (userId && token) {
            const merchant = await getMerchant(userId, token);
            if (merchant.name && merchant.address) {
                router.replace('/merchant/dashboard');
            } else {
                window.alert('You are not a merchant');
                router.replace('/merchant/');
            }
        }
    }

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            console.log('userId', userId);
            getMerchantDetails();
        }
    }, [isLoaded, isSignedIn, router]);


    if (isLoaded && isSignedIn) {
        return null;
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
    };

    const renderContent = () => {
        if (showMerchantForm) {
            return (
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-3 w-full max-w-[602px]">
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode='modal'>
                            <button
                                className="flex relative justify-center items-center px-3 py-2.5 h-12 bg-white border border-gray-200 border-solid cursor-pointer duration-[0.2s] rounded-[100px] transition-[background-color] w-[604px] max-md:w-full max-sm:px-2.5 max-sm:py-2 max-sm:h-11 hover:bg-gray-50"
                                aria-label="Sign in with Google"
                            >
                                <div className="flex items-center mr-3">
                                    <Image className='w-[18px] h-[18px]' src={googleIcon} alt="google" />
                                </div>
                                <span className="text-base font-medium text-zinc-700 max-sm:text-sm">
                                    Sign in with Google
                                </span>
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <div className="flex flex-col gap-3">
                        <span className="text-[16px]">Username</span>
                        <input
                            type="text"
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full rounded-[30px] bg-white focus:outline-none px-3 text-[14px] border-[0.8px] border-[#E7EAEB] h-[44px]"

                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <span className="text-[16px]">Solana Address</span>
                        <input
                            type="text"
                            placeholder="Solana Address"
                            value={formData.solAddress}
                            onChange={(e) => setFormData({ ...formData, solAddress: e.target.value })}
                            className="w-full rounded-[30px] bg-white focus:outline-none px-3 text-[14px] border-[0.8px] border-[#E7EAEB] h-[44px]"

                        />
                    </div>

                    <div className="flex justify-between mt-[39px] items-center gap-2">
                        <button onClick={() => setShowMerchantForm(false)} className="border cursor-pointer border-[#24D5FB] w-[298px] py-3 text-[#25C5E5] rounded-[36px] h-min">
                            Go Back
                        </button>
                        <button
                            type="submit"
                            className="border cursor-pointer text-white flex-1 connect_btn w-full py-3  rounded-[36px]"
                        >
                            Submit
                        </button>
                    </div>

                </form>
            );
        }

        return (
            <>
                <button
                    className="border cursor-pointer border-[#24D5FB] w-[298px] py-3 text-[#25C5E5] rounded-[36px] mb-4"
                    onClick={() => setShowMerchantForm(true)}
                >
                    Become a Merchant
                </button>

                <SignedIn>
                    <UserButton />
                </SignedIn>
                <SignedOut>
                    <SignInButton mode='modal'>
                        <button className='border cursor-pointer border-[#24D5FB] w-[298px] py-3 text-[#25C5E5] rounded-[36px]'>
                            Sign in
                        </button>
                    </SignInButton>
                </SignedOut>
            </>
        );
    };


    return (
        <main className="flex flex-col items-center px-5 py-20 w-full min-h-screen bg-cyan-100">
            <h1 className="mb-12 text-6xl tracking-tighter text-sky-950 max-sm:mb-8 max-sm:text-5xl">
                0xPay.
            </h1>
            <section className="flex flex-col justify-center items-center px-5 py-14 w-full bg-cyan-50 rounded-3xl border border-solid border-cyan-400 border-opacity-10 max-w-[909px] max-md:px-5 max-md:py-10 max-sm:px-4 max-sm:py-8">
                <h2 className="mb-14 text-2xl leading-10 text-center text-slate-900 max-sm:mb-10 max-sm:text-xl">
                    Welcome to merchant dashboard
                </h2>
                {renderContent()}
            </section>
        </main>
    );
};

export default Page;