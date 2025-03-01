'use client'
import { useAuth, UserButton } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import plus from '@/assets/plus.svg'
import { useRouter } from 'next/navigation'

const page = () => {

    const [isOpen, setIsOpen] = useState(false)
    const [collections, setCollections] = useState([])
    const [formData, setFormData] = useState({
        amount: '',
        solAddress: ''
    })

    const { isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isSignedIn) {
            router.push('/merchant');
        }
    }, [isSignedIn, router]);

    if (!isSignedIn) {
        return null; 
    }

    return (


        <div className=" w-full p-6 bg-[#CAF0F8]">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">0xPay</h1>
                <UserButton afterSignOutUrl="/" />
            </div>

            {/* Create Collection Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="mb-6 create-collection-btn px-4 py-[27px]  w-[367px] h-[172px] 
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
                                <div className="flex flex-col gap-3 w-full">
                                    <span className="text-[16px]">Sol Address</span>
                                    <input
                                        type="text"
                                        placeholder="0xpp45964509o70909548509tty89"
                                        className="w-full rounded-[30px] bg-white focus:outline-none px-3 text-[14px] border-[0.8px] border-[#E7EAEB] h-[44px]"
                                        value={formData.solAddress}
                                        onChange={(e) => setFormData({ ...formData, solAddress: e.target.value })}
                                    />
                                </div>

                                <div className="text-[#0AF] px-[10px] py-3 rounded-[12px] bg-[#CAF0F866]">
                                    This is your solana wallet linked to merchant account, funds will be sent directly to this wallet and cannot be recovered by us in case of any loss
                                </div>

                                <div className="flex w-full justify-center gap-2">
                                    <button
                                        className='connect_btn text-white py-3 w-[298px]'
                                        onClick={() => {
                                            // Handle form submission
                                            setIsOpen(false)
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
            <div className="overflow-x-auto mt-[111px]">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className='text-[14px] font-normal'>
                            <th className="">Amount</th>
                            <th className="">Date</th>
                            <th className=""> From</th>
                            <th className="">Status</th>
                            <th className="">Collection Link</th>
                            <th className="">Transaction Hash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {collections.map((collection: any) => (
                            <tr key={collection.id}>
                                <td className="">{collection.amount}</td>
                                <td className="">{collection.date}</td>
                                <td className="">{collection.from}</td>
                                <td className="">{collection.status}</td>
                                <td className="">{collection.collectionLink}</td>
                                <td className="">{collection.transactionHash}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default page