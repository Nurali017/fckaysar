import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import kaisarLogo from "@/assets/kaisar-logo.jpg";

interface GoalNotificationProps {
    show: boolean;
    onClose: () => void;
    scorer: string;
    minute: string;
}

export const GoalNotification = ({ show, onClose, scorer, minute }: GoalNotificationProps) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="absolute top-14 left-4 right-4 z-50"
                >
                    <div className="bg-red-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                            <img src={kaisarLogo} alt="Kaisar" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <div className="font-black text-lg leading-none mb-1">ГОЛ!</div>
                            <div className="text-sm font-medium opacity-90">{scorer} {minute}'</div>
                        </div>
                        <div className="text-2xl animate-bounce">⚽️</div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
