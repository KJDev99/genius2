"use client";

import React, { useState, useEffect } from 'react';
import { useApiStore } from '@/store/useApiStore';
import { ChevronLeft, ChevronRight, PackageOpen, Filter } from 'lucide-react';

export default function SupplierOrder() {
    const { getDataToken, loading } = useApiStore();

    // States
    const [orders, setOrders] = useState([]);
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState(''); // Filter: 'Ожидание', 'Обрабатывается', 'Отправлен'
    const limit = 12;

    useEffect(() => {
        fetchOrders();
    }, [currentPage, statusFilter]);

    const fetchOrders = async () => {
        try {
            const url = `/orders/supplier/orders/?page=${currentPage}&limit=${limit}${statusFilter ? `&status=${statusFilter}` : ''}`;
            const response = await getDataToken(url);
            if (response) {
                setOrders(response.results || []);
                setCount(response.count || 0);
            }
        } catch (err) {
            console.error('Buyurtmalarni yuklashda xatolik:', err);
        }
    };

    const totalPages = Math.ceil(count / limit);

    return (
        <div className="mt-20 max-md:pt-4 ">
            {/* Header va Filter */}
            <div className="flex justify-between items-center mb-8 max-md:flex-col max-md:items-start gap-4">
                <h1 className="text-[28px] md:text-[32px] text-[#272727]">
                    Все заказы
                </h1>

                <div className="relative min-w-[200px]">
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1); // Filter o'zgarganda 1-sahifaga qaytish
                        }}
                        className="w-full h-[45px] pl-4 pr-10 bg-white border border-gray-200 rounded-xl outline-none appearance-none text-sm font-medium text-gray-700 focus:border-[#C9A76B] transition-all cursor-pointer shadow-sm"
                    >
                        <option value="">Все заказы</option>
                        <option value="Ожидание">Ожидание</option>
                        <option value="Обрабатывается">Обрабатывается</option>
                        <option value="Отправлен">Отправлен</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <Filter size={18} />
                    </div>
                </div>
            </div>

            {/* Jadval qismi */}
            <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
                {!loading && orders.length === 0 ? (
                    /* Bo'sh holat (Empty State) */
                    <div className="flex flex-col items-center justify-center py-20">
                        <PackageOpen size={64} className="text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900">Заказов пока нет</h3>
                        <p className="text-gray-500">В данном разделе пока отсутствуют активные заказы.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-500 text-[13px] uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-5 font-medium">№ заказа</th>
                                    <th className="px-6 py-5 font-medium">Дата</th>
                                    <th className="px-6 py-5 font-medium">Товар</th>
                                    <th className="px-6 py-5 font-medium">Кол-во</th>
                                    <th className="px-6 py-5 font-medium">Сумма</th>
                                    <th className="px-6 py-5 font-medium">Статус</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => {
                                    const product = order.order_products[0]; // Asosiy ko'rinadigan mahsulot
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="px-6 py-5 text-gray-400 font-medium">#{order.id}</td>
                                            <td className="px-6 py-5 text-gray-900 text-sm">
                                                {new Date(order.created_at).toLocaleDateString('ru-RU')}
                                            </td>
                                            <td className="px-6 py-5 font-medium text-gray-900 max-w-[200px] truncate">
                                                {product?.product?.name || 'Без названия'}
                                            </td>
                                            <td className="px-6 py-5 text-gray-600 text-sm">
                                                {product?.quantity} м
                                            </td>
                                            <td className="px-6 py-5 text-[#C3974C]">
                                                {parseFloat(order.total_price).toLocaleString()} ₽
                                            </td>
                                            <td className="px-6 py-5">
                                                <StatusBadge status={product?.status} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination (Sahifalash) */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-10 gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        // Paginationda juda ko'p sahifa bo'lsa mantiqni qisqartirish mumkin, hozircha oddiy varianti:
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => setCurrentPage(pageNumber)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${currentPage === pageNumber
                                    ? 'bg-[#D8C19A] text-white shadow-md'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-[#D8C19A]'
                                    }`}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}

// Status uchun maxsus yorliq komponenti
function StatusBadge({ status }) {
    const statusStyles = {
        'Отправлен': 'bg-gradient-to-r from-[#D8C19A] to-[#C3974C] text-white',
        'Обрабатывается': 'bg-[#D8C19A]/30 text-[#8B6E3D] border border-[#D8C19A]/50',
        'Ожидание': 'bg-[#F3F4F6] text-[#6B7280] border border-gray-200',
    };

    return (
        <span className={`px-5 py-2 rounded-xl text-[13px] font-medium inline-block min-w-[140px] text-center shadow-sm ${statusStyles[status] || statusStyles['Ожидание']}`}>
            {status}
        </span>
    );
}