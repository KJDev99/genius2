import React from 'react'
import { X, CheckCircle2, ChevronDown } from 'lucide-react';

export default function SuccessModal({ isOpen, onClose, amount }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-[450px] rounded-[32px] p-10 flex flex-col items-center text-center shadow-2xl animate-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} className="border border-gray-200 rounded-full p-1" />
                </button>

                {/* Markaziy belgi (3-rasmdagi media qismi) */}
                <div className="w-[100px] h-[100px] mb-8 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-[#D8C19A]/20 rounded-full animate-pulse"></div>
                    <div className="w-16 h-16 bg-white border-2 border-[#D8C19A] rounded-full flex items-center justify-center z-10">
                        <CheckCircle2 size={40} className="text-[#C3974C]" />
                    </div>
                    {/* Atrofdagi to'lqinsimon shakl (CSS bilan) */}
                    <div className="absolute inset-0 border border-[#D8C19A]/30 rounded-[35%] rotate-45"></div>
                    <div className="absolute inset-0 border border-[#D8C19A]/30 rounded-[35%] -rotate-45"></div>
                </div>

                <h2 className="text-[24px] font-bold text-[#D8C19A] leading-tight mb-4 uppercase tracking-wider">
                    Запрос на вывод получен!
                </h2>

                <p className="text-gray-500 text-sm">
                    {amount} ₽ поступят в течение 3 рабочих дней
                </p>
            </div>
        </div>
    );
}