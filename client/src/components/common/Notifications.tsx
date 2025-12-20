"use client";

import { Bell, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    is_read: boolean;
    created_at: string;
}

export default function Notifications() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuthStore();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isAuthenticated) {
            fetchNotifications();
            const interval = setInterval(() => fetchNotifications(true), 30000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated && isOpen) {
            fetchNotifications(true);
        }
    }, [isOpen]);

    const fetchNotifications = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        try {
            const response = await api.get('/communication/notifications/');
            setNotifications(response.data.results || response.data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/communication/notifications/${id}/`, { is_read: true });
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
            await Promise.all(unreadIds.map(id => api.patch(`/communication/notifications/${id}/`, { is_read: true })));
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    if (!mounted || !isAuthenticated) return null;

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-white/90 hover:text-white transition-colors"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800">Notifications</h3>
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} className="text-xs text-brand-blue font-semibold hover:underline">
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <Loader2 className="animate-spin mx-auto text-brand-blue" size={32} />
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <Bell size={48} className="mx-auto mb-2 opacity-30" />
                                    <p>No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        onClick={() => {
                                            if (!notification.is_read) markAsRead(notification.id);
                                            if (notification.link) {
                                                window.location.href = notification.link;
                                                setIsOpen(false);
                                            }
                                        }}
                                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${notification.is_read ? 'opacity-60' : 'bg-blue-50/30'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-sm text-gray-900">{notification.title}</h4>
                                            <span className="text-xs text-gray-400">{getTimeAgo(notification.created_at)}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{notification.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        {notifications.length > 0 && (
                            <div className="p-2 text-center border-t border-gray-100">
                                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-sm text-brand-blue font-bold hover:underline py-2 block">
                                    View All in Dashboard
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
