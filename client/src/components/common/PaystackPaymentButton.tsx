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
            onClick={(e) => {
                e.preventDefault();

                if (!publicKey) {
                    alert("Payment system configuration error: Public key is missing. Please contact support.");
                    return;
                }

                initializePayment({ onSuccess, onClose });
            }}
            className={className}
        >
            {text}
        </button>
    );
};

export default PaystackPaymentButton;
