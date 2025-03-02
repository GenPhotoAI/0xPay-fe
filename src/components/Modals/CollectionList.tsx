import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import toast, { Toaster } from 'react-hot-toast'

const CollectionList = ({ collections, setIsCollectionLinksModalOpen, isCollectionLinksModalOpen }: { collections: any[], setIsCollectionLinksModalOpen: (isOpen: boolean) => void, isCollectionLinksModalOpen: boolean }) => {
    return (
        <>
            <Toaster position="top-right" />
            <AnimatePresence>
                {isCollectionLinksModalOpen && (
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
                            className="py-[20px] px-3 w-[90%] relative max-w-[723px] h-full flex flex-col items-center max-h-[75vh] text-black selectTokenPopup"
                        >
                            <button
                                onClick={() => setIsCollectionLinksModalOpen(false)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#D4F8FF]"
                            >
                                <span className="text-2xl">&times;</span>
                            </button>

                            <div className="overflow-x-auto max-h-full w-full custom-scrollbar">
                                <table className="min-w-full border-collapse">
                                    <thead>
                                        <tr className='text-[14px] font-normal'>
                                            <th className="w-1/2 text-left py-4 border-b border-[#15151526]">Amount</th>
                                            <th className="w-1/2 text-left py-4 border-b border-[#15151526]">Collection Link</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {collections?.map((collection: any) => (
                                            <tr key={`${collection.id}-${Math.random()}`}>
                                                <td className="w-1/2 py-4 border-b border-[#15151526]">{`${collection.amount / 10 ** 6} USDC`}</td>
                                                <td className="w-1/2 py-4 border-b border-[#15151526]">
                                                    <div className="flex items-center gap-2">
                                                        <span className='text-[#023047] truncate max-w-[300px]'>{`${process.env.NEXT_PUBLIC_APP_URL}/user/${collection.id}`}</span>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL}/user/${collection.id}`)
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

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>

    )
}

export default CollectionList