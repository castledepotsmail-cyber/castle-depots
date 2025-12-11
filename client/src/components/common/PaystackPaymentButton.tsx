"use client";

import React from 'react';
import { usePaystackPayment } from 'react-paystack';

interface PaystackPaymentButtonProps {
    email: string;
    amount: number;
    publicKey: string;
    text: string;
    onSuccess: (reference: any) => void;
    onClose: () => void;
    className?: string;
}

const PaystackPaymentButton = ({ email, amount, publicKey, text, onSuccess, onClose, className }: PaystackPaymentButtonProps) => {
    const config = {
        reference: (new Date()).getTime().toString(),
        email,
        amount,
        publicKey,
    };

    const initializePayment = usePaystackPayment(config);

    return (
        <button
            onClick={() => {
                initializePayment({ onSuccess, onClose });
            }}
            className={className}
        >
            {text}
        </button>
    );
};

export default PaystackPaymentButton;
