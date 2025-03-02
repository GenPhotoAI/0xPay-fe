import React, { createContext, useContext } from 'react';

interface PaymentData {
    amount: number;
    merchant: {
        address: string;
        name: string;
        currency: string;
    }
    userSelectedToken?: {
        name: string;
        symbol: string;
        logoURI: string;
    };
}

interface PaymentContextType {
    paymentData: PaymentData;
    amount: number;
    setPaymentData: (data: PaymentData) => void;
}

export const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePaymentContext = () => {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error('usePaymentContext must be used within a PaymentProvider');
    }
    return context;
};