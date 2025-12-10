"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const PaystackButton = dynamic(
    () => import('react-paystack').then((mod) => mod.PaystackButton),
    { ssr: false }
);

interface PaystackPaymentButtonProps {
    email: string;
    amount: number;
    publicKey: string;
    text: string;
    onSuccess: (reference: any) => void;
    onClose: () => void;
    className?: string;
}

export default function PaystackPaymentButton(props: PaystackPaymentButtonProps) {
    return <PaystackButton {...props} />;
}
