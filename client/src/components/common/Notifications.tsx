"use client";

import { Bell } from "lucide-react";
import { useState } from "react";

export default function Notifications() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: "Order Shipped", message: "Your order #CD-8821 has been shipped.", time: "2m ago", read: false },
        { id: 2, title: "Flash Sale Alert", message: "50% OFF on Kitchenware starts now!", time: "1h ago", read: false },
        { id: 3, title: "Welcome", message: "Thanks for joining Castle Depots!", time: "1d ago", read: true },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-white/90 hover:text-white transition-colors"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800">Notifications</h3>
                            <button className="text-xs text-brand-blue font-semibold hover:underline">Mark all read</button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.map(notification => (
                                <div key={notification.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${notification.read ? 'opacity-60' : 'bg-blue-50/30'}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-sm text-gray-900">{notification.title}</h4>
                                        <span className="text-xs text-gray-400">{notification.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-600">{notification.message}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-2 text-center border-t border-gray-100">
                            <button className="text-sm text-brand-blue font-bold hover:underline py-2">View All</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
