"use client";

import React, { useState } from 'react';
import { X, CheckCircle2, ChevronDown } from 'lucide-react';
import SuccessModal from './success-modal';

export default function SupplierBinance() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Miqdor boshlang'ich holatda nol
    const [amount, setAmount] = useState('0');

    // Barcha statistik qiymatlar nol holatiga keltirildi
    const stats = [
        { label: 'Баланс', value: '0 ₽', sub: 'Доступно к выводу', primary: true },
        { label: 'За месяц', value: '0 ₽', sub: '0% за месяц', green: true },
        { label: 'Комиссия', value: '0%', sub: 'Текущая ставка' },
    ];

    // Tarix qismi bo'sh massiv holatiga keltirildi (yoki ixtiyoriy nol qiymatlar bilan)
    const history = [];

    return (
        <div className="mt-20 max-md:pt-4 ">
            <h1 className="text-[28px]  mb-8">Финансы</h1>

            {/* Stat Kartochkalari */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm">
                        <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                        <h4 className={`text-[24px] font-bold mb-1 ${stat.primary ? 'text-[#272727]' : ''}`}>{stat.value}</h4>
                        <p className={`text-[12px] ${stat.green ? 'text-green-500' : 'text-gray-400'}`}>{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Oxirgi chiqarmalar jadvali */}
                <div className="lg:col-span-2">
                    <h3 className="text-[22px]  mb-6">Последние выводы</h3>
                    <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm min-h-[200px] flex items-center justify-center">
                        {history.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-sm">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Дата</th>
                                        <th className="px-6 py-4 font-medium">Сумма</th>
                                        <th className="px-6 py-4 font-medium">Статус</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {history.map((item, i) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-5 text-gray-600">{item.date}</td>
                                            <td className="px-6 py-5 font-medium text-[#C3974C]">{item.sum}</td>
                                            <td className="px-6 py-5">
                                                <span className={`px-4 py-2 rounded-xl text-sm font-medium inline-block min-w-[130px] text-center ${item.status === 'Выплачено'
                                                    ? 'bg-[#D8C19A]/20 text-[#8B6E3D]'
                                                    : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-400">Данные отсутствуют</p>
                        )}
                    </div>
                </div>

                {/* Pul chiqarish Formasi */}
                <div className="lg:col-span-1">
                    <h3 className="text-[22px]  mb-6">Запросить выплату</h3>
                    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-6">
                        <div>
                            <label className="text-gray-400 text-sm block mb-2">Сумма к выводу</label>
                            <input
                                type="text"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full h-[60px] px-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#C9A76B] text-lg font-medium"
                            />
                        </div>

                        <div>
                            <label className="text-gray-400 text-sm block mb-2">Способы оплаты</label>
                            <div className="relative">
                                <select className="w-full h-[60px] px-4 bg-white border border-gray-200 rounded-xl outline-none appearance-none cursor-pointer pr-10">
                                    <option value="">Выберите способ оплаты</option>
                                    <option>Банковская карта *****1234</option>
                                    <option>Uzcard/Humo *****5678</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full h-[66px] rounded-xl bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] text-white font-medium text-lg hover:shadow-lg transition-all"
                        >
                            Заказать выплату
                        </button>
                        <p className="text-center text-gray-400 text-xs mt-4">
                            Выплаты обрабатываются в течение 1-3 рабочих дней
                        </p>
                    </div>
                </div>
            </div>

            {/* Muvaffaqiyatli yakunlash Modali */}
            <SuccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} amount={amount} />
        </div>
    );
}