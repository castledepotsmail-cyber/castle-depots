"use client";
import { usePaystackPayment } from 'react-paystack';
import { useEffect } from 'react';

interface Props {
    config: any;
    onSuccess: (reference: any) => void;
    onClose: () => void;
}

const PaystackHandler = ({ config, onSuccess, onClose }: Props) => {
    const initializePayment = usePaystackPayment(config);

    useEffect(() => {
        // @ts-ignore
        initializePayment({ onSuccess, onClose });
    }, []);

    return null;
};

export default PaystackHandler;
