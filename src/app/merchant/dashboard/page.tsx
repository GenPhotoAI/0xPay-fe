'use client'
import { useAuth, UserButton } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import plus from '@/assets/plus.svg'
import { useRouter } from 'next/navigation'
import { createCollection, getCollections, getPaymentsSoFar } from '@/utils/helper'
import link from '@/assets/link.svg'

import toast, { Toaster } from 'react-hot-toast';
import CollectionList from '@/components/Modals/CollectionList'

const page = () => {
    const { userId, getToken } = useAuth()
    const { isSignedIn } = useAuth();
    const router = useRouter();


    const [isOpen, setIsOpen] = useState(false)
    const [isCollectionLinksModalOpen, setIsCollectionLinksModalOpen] = useState(false)

    const [collections, setCollections] = useState([])
    const [formData, setFormData] = useState({
        amount: ''
    })

    const [paymentsSoFar, setPaymentsSoFar] = useState<any[]>([])

    useEffect(() => {
        const fetchPaymentsSoFar = async () => {
            const token = await getToken();
            if (!token || !userId) return;
            const response = await getPaymentsSoFar(token, userId);
            setPaymentsSoFar(response?.paymentAttempts);
            console.log('response of payments so far', response);
        }

        // Make initial call
        fetchPaymentsSoFar();

        const interval = setInterval(() => {
            fetchPaymentsSoFar();
        }, 10000);

        return () => clearInterval(interval);
    }, [userId, getToken]);


    useEffect(() => {
        const fetchCollections = async () => {
            const token = await getToken();
            if (!token || !userId) return;
            const response = await getCollections(token, userId);
            setCollections(response?.paymentRequests);

            console.log('response of collections', response);
        }

        if (isSignedIn) {
            fetchCollections();
        }
    }, [userId, getToken, isSignedIn]);


    if (!isSignedIn) {
        return null;
    }

    // const { stripeId, amount } = req.body;
    // router.post("/create", async (req, res) => {
    //     payments / merchant / create

    const handleCreateCollection = async () => {
        const loadingToast = toast.loading('Creating collection...');
        try {
            const token = await getToken();
            if (!token || !userId) return;
            const response = await createCollection(formData, token, userId);

            if (response?.message === 'success') {
                toast.success('Collection created successfully', { id: loadingToast });
            } else {
                toast.error('Failed to create collection', { id: loadingToast });
            }
        } catch (error) {
            console.log('error in handleCreateCollection', error);
            toast.error('Failed to create collection', { id: loadingToast });
        } finally {
            setIsOpen(false)
        }
    }


    return (
        <div className=" w-full p-6 bg-[#CAF0F8]">

            <Toaster position="top-right" />

            {/* Header Section */}
            <div className="flex justify-between items-center mb-[38px]">
                <h1 className="text-2xl font-bold">0xPay</h1>
                <UserButton afterSignOutUrl="/" />
            </div>

            {/* Create Collection Button */}

            <div className="flex gap-3">
                <button
                    onClick={() => setIsOpen(true)}
                    className=" create-collection-btn px-4 py-[27px]  w-[367px] h-[172px] 
                hover:shadow-lg hover:transform hover:-translate-y-0.5 
                active:shadow-md active:transform active:translate-y-0 
                transition-all duration-150
                hover:bg-gray-50 active:bg-gray-100 flex text-[24px] gap-2 justify-start items-end"

                >
                    <div className="flex gap-2 items-center">
                        <Image src={plus} alt="plus" className='rounded-full' />
                        Create Collection
                    </div>
                </button>
                <button
                    onClick={() => setIsCollectionLinksModalOpen(true)}
                    className=" create-collection-btn px-4 py-[27px]  w-[367px] h-[172px] 
                hover:shadow-lg hover:transform hover:-translate-y-0.5 
                active:shadow-md active:transform active:translate-y-0 
                transition-all duration-150
                hover:bg-gray-50 active:bg-gray-100 flex text-[24px] gap-2 justify-start items-end"

                >
                    <div className="flex gap-2 items-center">
                        <Image src={link} alt="plus" className='rounded-full' />
                        Collection Links
                    </div>
                </button>
            </div>

            {/* Collection Links Modal */}
            <CollectionList
                collections={collections}
                setIsCollectionLinksModalOpen={setIsCollectionLinksModalOpen}
                isCollectionLinksModalOpen={isCollectionLinksModalOpen}
            />

            {/* Modal Popup */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 popup-backBg flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="py-12 w-[90%] relative max-w-[909px] h-full flex flex-col items-center max-h-[75vh] createCollectionPopup"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#D4F8FF]"
                            >
                                <span className="text-2xl">&times;</span>
                            </button>

                            <div className="flex flex-col items-center gap-6 w-full max-w-[602px]">
                                <h2 className="text-[24px] mb-4">Create New Collection</h2>
                                <div className="flex flex-col gap-3 w-full">
                                    <span className="text-[16px]">Amount</span>
                                    <input
                                        type="text"
                                        placeholder="Enter Amount"
                                        className="w-full rounded-[30px] bg-white focus:outline-none px-3 text-[14px] border-[0.8px] border-[#E7EAEB] h-[44px]"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                                <div className="text-[#0AF] px-[10px] py-3 px-4 rounded-[12px] bg-[#CAF0F866]">
                                    This is your solana wallet linked to merchant account, funds will be sent directly to this wallet and cannot be recovered by us in case of any loss
                                </div>

                                <div className="flex w-full justify-center gap-2">
                                    <button
                                        className='connect_btn text-white py-3 px-4 w-[298px]'
                                        onClick={() => {
                                            handleCreateCollection();
                                        }}>
                                        Create
                                    </button>
                                </div>
                            </div>


                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Collections Table */}

            <table className='w-full mt-[111px]'>
                <thead>
                    <tr>
                        <th className='border-b py-3 px-4 border-[#15151526]'>Amount</th>
                        <th className='border-b py-3 px-4 border-[#15151526]'>Date</th>
                        <th className='border-b py-3 px-4 border-[#15151526]'>From</th>
                        <th className='border-b py-3 px-4 border-[#15151526]'>Status</th>
                        <th className='border-b py-3 px-4 border-[#15151526]'>Collection Link</th>
                        <th className='border-b py-3 px-4 border-[#15151526]'>Transaction Hash</th>
                    </tr>
                </thead>
                <tbody>
                    {paymentsSoFar?.map((payment) => (
                        <tr key={payment.id} className='py-3 px-4'>
                            <td className='py-3 px-4 border-b border-[#15151526]'>{payment.amount}</td>
                            <td className='py-3 px-4 border-b border-[#15151526]'>{new Date(payment.createdAt).toLocaleDateString('en-GB')}</td>
                            <td className='py-3 px-4 border-b border-[#15151526]'>
                                <div className="flex items-center gap-2">
                                    <span className='text-[#023047] truncate max-w-[300px]'>{`${payment.transaction.userPaymentAddress}`}</span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${payment.transaction.userPaymentAddress}`)
                                            toast.success('Copied to clipboard')
                                        }}
                                        className="p-1 hover:bg-gray-100 rounded-full flex-shrink-0"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                            <td className='py-3 px-4 border-b border-[#15151526]'>
                                <div className={`text-black px-2 py-1 rounded-2xl ${payment.status === 'pending' ? 'text-[#0AF]' : payment.status === 'failed' ? 'bg-[#FF0000]' : 'bg-[#B6EE7E]'}`}>
                                    {payment.status}
                                </div>
                            </td>
                            <td className='py-3 px-4 border-b border-[#15151526]'>
                                <div className="flex items-center gap-2">
                                    <span className='text-[#023047] truncate max-w-[300px]'>{`${process.env.NEXT_PUBLIC_APP_URL}/user/${payment.paymentRequestId}`}</span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL}/user/${payment.paymentRequestId}`)
                                            toast.success('Copied to clipboard')
                                        }}
                                        className="p-1 hover:bg-gray-100 rounded-full flex-shrink-0"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                            <td className='py-3 px-4 border-b border-[#15151526]'>
                                <div className="flex items-center gap-2">
                                    <span className='text-[#023047] truncate max-w-[300px]'>
                                        {`https://solscan.io/tx/${payment.transaction.transactionHash}`}
                                    </span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(`https://solscan.io/tx/${payment.transaction.transactionHash}`)
                                            toast.success('Copied to clipboard')
                                        }}
                                        className="p-1 hover:bg-gray-100 rounded-full flex-shrink-0"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default page