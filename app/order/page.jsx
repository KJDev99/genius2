"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useApiStore } from '@/store/useApiStore';
import { useCartStore } from '@/store/useCartStore';
import toast, { Toaster } from 'react-hot-toast';
import { IoCheckmarkCircle } from 'react-icons/io5';
import Button from '@/components/ui/Buttom';
import Input from '@/components/ui/Input';
import Title from '@/components/ui/Title';

export default function CheckoutPage() {
    const router = useRouter();
    const { getDataToken, postDataToken } = useApiStore();
    const { cartItems, getTotalPrice, clearCart } = useCartStore();

    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        city: '',
        street: '',
        house: '',
        apartment: '',
        postal_index: ''
    });

    const [deliveryMethods, setDeliveryMethods] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // User ma'lumotlarini olish
            const profileResponse = await getDataToken("/accounts/user/");
            console.log("Profile Response:", profileResponse);

            if (profileResponse) {
                setProfileData({
                    first_name: profileResponse.first_name || '',
                    last_name: profileResponse.last_name || '',
                    email: profileResponse.email || '',
                    phone_number: profileResponse.phone || '',
                    city: profileResponse.city || '',
                    street: profileResponse.street || '',
                    house: profileResponse.house || '',
                    apartment: profileResponse.flat || '',
                    postal_index: profileResponse.index || ''
                });
            }

            // Delivery methods
            const deliveryResponse = await getDataToken("/orders/delivery-methods/");
            console.log("Delivery Response:", deliveryResponse);

            let deliveryData = [];

            // Ma'lumotlarni qayta ishlash
            if (deliveryResponse?.data?.delivery_methods) {
                deliveryData = deliveryResponse.data.delivery_methods.map(method => ({
                    id: method.id,
                    name: method.name,
                    details: method.description || '',
                    price: method.price || 0
                }));
            } else if (deliveryResponse?.delivery_methods) {
                deliveryData = deliveryResponse.delivery_methods.map(method => ({
                    id: method.id,
                    name: method.name,
                    details: method.description || '',
                    price: method.price || 0
                }));
            } else if (Array.isArray(deliveryResponse?.data)) {
                deliveryData = deliveryResponse.data.map(method => ({
                    id: method.id,
                    name: method.name,
                    details: method.description || '',
                    price: method.price || 0
                }));
            } else if (Array.isArray(deliveryResponse)) {
                deliveryData = deliveryResponse.map(method => ({
                    id: method.id,
                    name: method.name,
                    details: method.description || '',
                    price: method.price || 0
                }));
            }

            console.log("Processed Delivery Data:", deliveryData);
            setDeliveryMethods(deliveryData);
            if (deliveryData.length > 0) {
                setSelectedDelivery(deliveryData[0].id);
            }

            // Payment methods
            const paymentResponse = await getDataToken("/orders/payment-methods/");
            console.log("Payment Response:", paymentResponse);

            let paymentData = [];

            if (paymentResponse?.data?.payment_methods) {
                paymentData = paymentResponse.data.payment_methods.map(method => ({
                    id: method.id,
                    name: method.name,
                    details: method.description || ''
                }));
            } else if (paymentResponse?.payment_methods) {
                paymentData = paymentResponse.payment_methods.map(method => ({
                    id: method.id,
                    name: method.name,
                    details: method.description || ''
                }));
            } else if (Array.isArray(paymentResponse?.data)) {
                paymentData = paymentResponse.data.map(method => ({
                    id: method.id,
                    name: method.name,
                    details: method.description || ''
                }));
            } else if (Array.isArray(paymentResponse)) {
                paymentData = paymentResponse.map(method => ({
                    id: method.id,
                    name: method.name,
                    details: method.description || ''
                }));
            }

            console.log("Processed Payment Data:", paymentData);
            setPaymentMethods(paymentData);
            if (paymentData.length > 0) {
                setSelectedPayment(paymentData[0].id);
            }
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
            toast.error("Ошибка загрузки данных");
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (value) => {
        return new Intl.NumberFormat("ru-RU", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Number(value) || 0);
    };

    const handleSubmitOrder = async () => {
        if (!profileData.city || !profileData.street || !profileData.house) {
            toast.error("Заполните данные адреса.");
            return;
        }

        if (!selectedDelivery) {
            toast.error("Выберите способ доставки");
            return;
        }

        if (!selectedPayment) {
            toast.error("Выберите способ оплаты");
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Корзина пуста");
            return;
        }

        setSubmitting(true);

        try {
            // Backend talab qilgan strukturaga moslashtirish
            const orderData = {
                product_list: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price // Backend bu maydonni talab qilayotgan bo'lsa
                })),
                city: profileData.city,
                street: profileData.street,
                house: profileData.house,
                flat: profileData.apartment || '',
                index: profileData.postal_index || '',
                // Backend 'total_price' ni hisoblashi mumkin yoki siz hisoblashingiz kerak
                total_price: getTotalPrice().toFixed(2),
                delivery_method: selectedDelivery,
                payment_method: selectedPayment,
                // Backend 'price_for_delivery' ni o'zi hisoblashi mumkin
                price_for_delivery: '0', // deliveryMethods ichidan olishingiz mumkin
                // Telefon maydoni backendda kerak bo'lsa
                phone: profileData.phone_number || ''
            };

            console.log("Sending order data:", orderData);
            const response = await postDataToken("/orders/create/", orderData);
            console.log("Order response:", response);

            // Toast xabarlarini keyinroq ko'rsatish uchun setTimeout
            setTimeout(() => {
                toast.success("Заказ успешно оформлен!");
            }, 100);

            if (response?.order_number) {
                setOrderNumber(response.order_number);
            } else if (response?.data?.order_number) {
                setOrderNumber(response.data.order_number);
            } else if (response?.id) {
                setOrderNumber(`ORD-${response.id}`);
            } else {
                const orderNum = `ORD-${Date.now()}`;
                setOrderNumber(orderNum);
            }

            clearCart();
            setShowSuccessModal(true);

        } catch (error) {
            console.error("Ошибка при оформлении заказа:", error);
            setTimeout(() => {
                toast.error("Ошибка при оформлении заказа");
            }, 100);
        } finally {
            setSubmitting(false);
        }
    };

    const totalPrice = getTotalPrice();
    const deliveryPrice = deliveryMethods.find(d => d.id === selectedDelivery)?.price || 0;
    const finalTotal = parseFloat(totalPrice) + parseFloat(deliveryPrice);

    if (loading) {
        return (
            <div className="max-w-[1200px] mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-lg">Загрузка...</div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0 && !showSuccessModal) {
        return (
            <div className="max-w-[1200px] mx-auto px-4 py-12">
                <h1 className="text-[24px] text-[#1E1E1E] mb-8">Оформление заказа</h1>
                <div className="flex flex-col items-center justify-center py-20">
                    <h2 className="text-2xl font-semibold text-[#1E1E1E] mb-2">
                        Корзина пуста
                    </h2>
                    <p className="text-[#1E1E1E]/60 mb-8">
                        Добавьте товары для оформления заказа
                    </p>
                    <Button
                        text="Перейти в каталог"
                        onClick={() => router.push("/catalog")}
                        className="w-[250px] h-14"
                    />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-[1200px] mx-auto px-4 py-8">
                {showSuccessModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                        <div className="bg-white rounded-[20px] p-8 max-w-[500px] w-full text-center">
                            <IoCheckmarkCircle className="text-green-500 text-7xl mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-[#1E1E1E] mb-2">
                                Заказ успешно оформлен!
                            </h2>
                            <p className="text-[#1E1E1E]/60 mb-2">
                                Номер заказа: <strong>{orderNumber}</strong>
                            </p>
                            <p className="text-[#1E1E1E]/60 mb-6">
                                Мы свяжемся с вами в ближайшее время для подтверждения заказа.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Button
                                    text="На главную"
                                    onClick={() => router.push("/")}
                                    className="w-[180px] h-14"
                                />
                                <Button
                                    text="В каталог"
                                    onClick={() => router.push("/catalog")}
                                    className="w-[180px] h-14 bg-[#E2E2E2] !text-[#1E1E1E]"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <h1 className="text-[24px] text-[#1E1E1E] mb-8">Оформление заказа</h1>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Left Column - Profile Data */}
                    <div className="space-y-6 lg:col-span-3 col-span-1">
                        {/* Personal Info */}
                        <div>
                            <div className="p-8 rounded-2xl grid grid-cols-2 gap-4" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                                <div className="flex justify-between items-center col-span-2">
                                    <div className="flex flex-col">
                                        <Title text={"Заполните личные данные"} size={"text-[18px]"} cls="uppercase" />
                                    </div>
                                </div>
                                <Input
                                    label='Имя'
                                    placeholder="Не указано"
                                    className={'h-[50px]'}
                                    value={profileData.first_name}
                                    onChange={(value) => setProfileData(prev => ({ ...prev, first_name: value }))}
                                    disabled={!!profileData.first_name}
                                />
                                <Input
                                    label='Фамилия'
                                    placeholder="Не указано"
                                    className={'h-[50px]'}
                                    value={profileData.last_name}
                                    onChange={(value) => setProfileData(prev => ({ ...prev, last_name: value }))}
                                    disabled={!!profileData.last_name}
                                />
                                <Input
                                    label='Email'
                                    placeholder="Не указано"
                                    className={'h-[50px]'}
                                    value={profileData.email}
                                    onChange={(value) => setProfileData(prev => ({ ...prev, email: value }))}
                                    disabled={!!profileData.email}
                                />
                                <Input
                                    label='Телефон'
                                    placeholder="Не указано"
                                    className={'h-[50px]'}
                                    value={profileData.phone_number}
                                    onChange={(value) => setProfileData(prev => ({ ...prev, phone_number: value }))}
                                    type="tel"
                                    disabled={!!profileData.phone_number}
                                />
                                <div className="flex justify-between items-center col-span-2 mt-6">
                                    <div className="flex flex-col">
                                        <Title text={"Заполните адрес"} size={"text-[18px]"} cls="uppercase" />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <Input
                                        label='Город'
                                        placeholder="Не указано"
                                        className={'h-[50px]'}
                                        value={profileData.city}
                                        onChange={(value) => setProfileData(prev => ({ ...prev, city: value }))}
                                        disabled={!!profileData.city}
                                    />
                                </div>
                                <Input
                                    label='Улица'
                                    placeholder="Не указано"
                                    className={'h-[50px]'}
                                    value={profileData.street}
                                    onChange={(value) => setProfileData(prev => ({ ...prev, street: value }))}
                                    disabled={!!profileData.street}
                                />
                                <Input
                                    label='Дом'
                                    placeholder="Не указано"
                                    className={'h-[50px]'}
                                    value={profileData.house}
                                    onChange={(value) => setProfileData(prev => ({ ...prev, house: value }))}
                                    disabled={!!profileData.house}
                                />
                                <Input
                                    label='Квартира'
                                    placeholder="Не указано"
                                    className={'h-[50px]'}
                                    value={profileData.apartment}
                                    onChange={(value) => setProfileData(prev => ({ ...prev, apartment: value }))}
                                    disabled={!!profileData.apartment}
                                />
                                <Input
                                    label='Индекс'
                                    placeholder="Не указано"
                                    className={'h-[50px]'}
                                    value={profileData.postal_index}
                                    onChange={(value) => setProfileData(prev => ({ ...prev, postal_index: value }))}
                                    disabled={!!profileData.postal_index}
                                />
                                <div className="w-full col-span-2 mt-6">
                                    <div className="grid grid-cols-5 gap-4">
                                        {/* Delivery Methods */}
                                        <div className='col-span-2'>
                                            <Title text={"Способ доставки"} size={"text-[18px]"} cls="uppercase mb-4" />
                                            <div className="space-y-3">
                                                {deliveryMethods.map((method) => (
                                                    <div
                                                        key={method.id}
                                                        className={`p-6 rounded-xl cursor-pointer transition-all border-1 ${selectedDelivery === method.id
                                                            ? 'bg-[linear-gradient(119.47deg,_#D8C19A_20.35%,_#C3974C_94.16%)] border-none'
                                                            : 'border-[#272727]/50'
                                                            }`}
                                                        onClick={() => setSelectedDelivery(method.id)}
                                                    >
                                                        <div className="flex justify-between items-start overflow-hidden">
                                                            <div className="flex-1">
                                                                <h3 className=" text-[#272727] mb-1">
                                                                    {method.name}
                                                                </h3>
                                                                <p className="text-sm text-[#27272799] text-nowrap">
                                                                    {method.details}
                                                                </p>
                                                            </div>
                                                            <div className="text-[#2C5AA0] font-bold ">
                                                                {method.price > 0 ? `${formatPrice(method.price)} ₽` : 'Бесплатно'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Payment Methods */}
                                        <div className='col-span-3'>
                                            <Title text={"Способ оплаты"} size={"text-[18px]"} cls="uppercase mb-4" />
                                            <div className="space-y-3">
                                                {paymentMethods.map((method) => (
                                                    <div
                                                        key={method.id}
                                                        className={`p-6 rounded-xl cursor-pointer transition-all border-1 overflow-hidden ${selectedPayment === method.id
                                                            ? 'bg-[linear-gradient(119.47deg,_#D8C19A_20.35%,_#C3974C_94.16%)] border-none'
                                                            : 'border-[#272727]/50'
                                                            }`}
                                                        onClick={() => setSelectedPayment(method.id)}
                                                    >
                                                        <h3 className="font-semibold text-[#1E1E1E] mb-1">
                                                            {method.name}
                                                        </h3>
                                                        <p className="text-sm text-[#1E1E1E]/60 text-nowrap">
                                                            {method.details}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 lg:col-span-2 col-span-1">
                        <div>
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-4 rounded-xl border border-gray-200 flex gap-4"
                                    >
                                        <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 items-center">
                                            <Image
                                                src={item.image || "/cart.png"}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-contain p-2"
                                                alt={item.name}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-[#1E1E1E] mb-1 line-clamp-2">
                                                {item.article}
                                            </h3>
                                            <p className="text-sm text-[#1E1E1E]/60 mb-2">
                                                {item.name}
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-[#1E1E1E]/60">
                                                    {item.quantity} шт × {formatPrice(item.price)} ₽
                                                </span>
                                                <span className=" text-[#272727]">
                                                    {formatPrice(parseFloat(item.price) * item.quantity)} ₽
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-[#2C5AA0]/5 sticky top-4">
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-[#1E1E1E]/60">
                                    <span>Товары :</span>
                                    <span>{formatPrice(totalPrice)} ₽</span>
                                </div>
                                <div className="flex justify-between text-[#1E1E1E]/60">
                                    <span>Доставка:</span>
                                    <span>{deliveryPrice > 0 ? `${formatPrice(deliveryPrice)} ₽` : 'Бесплатно'}</span>
                                </div>
                                <div className="border-t border-gray-300 pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#27272780]">
                                            Итоговая сумма:
                                        </span>
                                        <span className="text-2xl  text-[#272727]">
                                            {formatPrice(finalTotal)} ₽
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                text={submitting ? "Оформление..." : "Оформить"}
                                onClick={handleSubmitOrder}
                                disabled={submitting}
                                className="w-full h-[54px] mb-3 bg-gradient-to-br from-[#D8C19A] to-[#C3974C]"
                            />


                            <p className="text-xs text-[#1E1E1E]/60 text-center mt-4">
                                Нажимая на кнопку, вы соглашаетесь с условиями Политики конфиденциальности
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </>
    );
}