"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useApiStore } from '@/store/useApiStore';
import Link from 'next/link';

export default function SupplierDashboard() {
    const router = useRouter();
    const { getDataToken } = useApiStore();

    // States
    const [analytics, setAnalytics] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter for Chart
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchAllData();
    }, [selectedMonth, selectedYear]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // 1. Asosiy analitika
            const analyticsRes = await getDataToken('/orders/supplier/analytics/');
            if (analyticsRes) setAnalytics(analyticsRes);

            // 2. Grafika ma'lumotlari
            const salesRes = await getDataToken(`/orders/supplier/analytics/sales/?month=${selectedMonth}&year=${selectedYear}`);
            if (salesRes && salesRes.sales_data) {
                // Recharts uchun formatlash
                const formattedSales = salesRes.sales_data.map(item => ({
                    name: new Date(item.date).getDate().toString(),
                    price: parseFloat(item.total_price),
                }));
                setSalesData(formattedSales);
            }

            // 3. Oxirgi buyurtmalar (limit=5)
            const ordersRes = await getDataToken('/orders/supplier/orders/?limit=5');
            if (ordersRes && ordersRes.results) {
                setRecentOrders(ordersRes.results);
            }
        } catch (error) {
            console.error("Dashboard yuklashda xatolik:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !analytics) return <div className="p-10 text-center text-gray-500">Загрузка...</div>;

    return (
        <div className="mt-20 max-md:pt-4 space-y-10 ">
            {/* 1. Dashboard Header - Stat Kartochkalari */}
            <section>
                <h2 className="text-[28px] mb-6">Дэшборд</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Общий доход"
                        value={`${analytics?.total_income?.total?.toLocaleString()} ₽`}
                        change={`${analytics?.total_income?.difference}% от прошлого месяца`}
                        changeType={analytics?.total_income?.change_type}
                    />
                    <StatCard
                        title="Активные товары"
                        value={analytics?.active_products?.total}
                        change={`+${analytics?.active_products?.this_month} новых товаров`}
                        changeType="increase"
                    />
                    <StatCard
                        title="Заказов всего"
                        value={analytics?.orders_total?.total}
                        change={`на ${analytics?.orders_total?.difference} меньше, чем за 2025`}
                        changeType={analytics?.orders_total?.change_type}
                    />
                    <StatCard
                        title="Заказы в работе"
                        value={analytics?.orders_in_progress?.total}
                        change={`+${analytics?.orders_in_progress?.difference} за неделю`}
                        changeType="increase"
                    />
                </div>
            </section>

            {/* 2. Sotuvlar Grafigi */}
            <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-[24px]">Продажи</h3>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 outline-none text-sm font-medium"
                    >
                        <option value="1">Январь</option>
                        <option value="2">Февраль</option>
                        <option value="3">Март</option>
                        <option value="4">Апрель</option>
                        <option value="5">Май</option>
                        <option value="6">Июнь</option>
                        <option value="7">Июль</option>
                        <option value="8">Август</option>
                        <option value="9">Сентябрь</option>
                        <option value="10">Октябрь</option>
                        <option value="11">Ноябрь</option>
                        <option value="12">Декабрь</option>
                    </select>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesData}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#C9A76B" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#C9A76B" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEEEEE" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} tickFormatter={(val) => `${val}k`} />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#C9A76B"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* 3. Oxirgi buyurtmalar jadvali */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[24px]">Последние заказы</h3>
                    <Link href="/supplier/order" className="bg-[#D8C19A] hover:bg-[#C3974C] text-white px-6 py-2 rounded-xl transition-all">
                        Все заказы
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">№ заказа</th>
                                <th className="px-6 py-4 font-medium">Дата</th>
                                <th className="px-6 py-4 font-medium">Товар</th>
                                <th className="px-6 py-4 font-medium">Кол-во</th>
                                <th className="px-6 py-4 font-medium">Сумма</th>
                                <th className="px-6 py-4 font-medium">Статус</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentOrders.slice(0, 3).map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-400">#{order.id}</td>
                                    <td className="px-6 py-4 text-gray-900">{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium">
                                        {order.order_products[0]?.product?.name || 'Нет названия'}
                                    </td>
                                    <td className="px-6 py-4">{order.order_products[0]?.quantity} м</td>
                                    <td className="px-6 py-4 text-[#C3974C]">
                                        {parseFloat(order.order_products[0]?.price).toLocaleString()} ₽
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={order.order_products[0]?.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

// Yordamchi Komponentlar
function StatCard({ title, value, change, changeType }) {
    const isIncrease = changeType === 'increase';
    const isDecrease = changeType === 'decrease';

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-sm mb-2">{title}</p>
            <h4 className="text-[24px] font-bold text-gray-900 mb-1">{value}</h4>
            <p className={`text-[12px] ${isIncrease ? 'text-green-500' : isDecrease ? 'text-red-500' : 'text-gray-400'}`}>
                {change}
            </p>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        'Отправлен': 'bg-[#D8C19A] text-white',
        'Обрабатывается': 'bg-[#D8C19A]/40 text-[#8B6E3D]',
        'Ожидание': 'bg-gray-100 text-gray-500',
    };

    return (
        <span className={`px-4 py-1.5 rounded-lg text-sm font-medium ${styles[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    );
}