import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'

const SelectToken = ({
    isPopupOpen,
    setIsPopupOpen,
    selectedToken,
    setSelectedToken,
    tokens
}: {
    isPopupOpen: boolean;
    setIsPopupOpen: (isPopupOpen: boolean) => void;
    tokens: any[];
    selectedToken: any;
    setSelectedToken: (selectedToken: any) => void;
}) => {

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showFade, setShowFade] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');

    const checkScroll = () => {
        const container = scrollContainerRef.current;
        if (container) {
            const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 10; // 10px threshold
            setShowFade(!isAtBottom);
        }
    };

    useEffect(() => {
        checkScroll();
    }, [tokens]);


    const filteredTokens = tokens.filter(token =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (

        <AnimatePresence>
            {isPopupOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 popup-backBg flex items-center justify-center z-50"
                    onClick={() => setIsPopupOpen(false)}
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            transition: {
                                type: "spring",
                                duration: 0.5,
                                bounce: 0.3
                            }
                        }}
                        exit={{
                            scale: 0.5,
                            opacity: 0,
                            transition: {
                                duration: 0.2
                            }
                        }}
                        className="p-6 w-[90%] max-w-[500px] max-h-[75vh] relative selectTokenPopup"
                    >
                        <input
                            type="text"
                            autoFocus
                            className="searchTokenInput h-[60px] focus:outline-none w-full px-3 py-2 text-black"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search Token" />

                        <div className="relative">
                            <div
                                ref={scrollContainerRef}
                                onScroll={checkScroll}
                                className="overflow-y-auto max-h-[50vh] custom-scrollbar mt-[10px]"
                            >
                                {
                                    filteredTokens?.map((token, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between px-2 py-4 border-b border-solid border-[#1515151A] hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => {
                                                setSelectedToken({
                                                    ...token,
                                                    logoURI: token.logoURI
                                                });
                                                setIsPopupOpen(false);
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 relative">
                                                    <img
                                                        fetchPriority='high'
                                                        src={token.logoURI}
                                                        alt={token.name}
                                                        className="rounded-full"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{token.symbol}</p>
                                                    <p className="text-sm text-gray-500">{token.name}</p>
                                                </div>
                                            </div>
                                            {/* <div className="text-right">
                                                <p className="font-medium text-gray-900">{token.amount}</p>
                                                <p className="text-sm text-gray-500">{token.value}</p>
                                            </div> */}
                                        </div>
                                    ))
                                }
                            </div>
                            {showFade && (
                                <div
                                    className="absolute bottom-0 left-0 right-0 h-[75px] pointer-events-none"
                                    style={{
                                        background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)'
                                    }}
                                />
                            )}
                        </div>
                    </motion.div>
                </motion.div>

            )}
        </AnimatePresence>
    )
}

export default SelectToken


