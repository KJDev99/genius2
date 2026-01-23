"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LuMinus, LuPlus, LuTrash2 } from "react-icons/lu";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";
import Button from "@/components/ui/Buttom";

export default function CartPage() {
    const router = useRouter();
    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalPrice,
    } = useCartStore();

    const totalPrice = getTotalPrice();

    const formatPrice = (value) => {
        return new Intl.NumberFormat("ru-RU", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(value) || 0);
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            toast.success("Товар удален из корзины");
        } else {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleRemoveItem = (productId) => {
        removeFromCart(productId);
        toast.success("Товар удален из корзины");
    };

    const handleClearCart = () => {
        if (window.confirm("Вы уверены, что хотите очистить корзину?")) {
            clearCart();
            toast.success("Корзина очищена");
        }
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.error("Корзина пуста");
            return;
        }

        router.push('/order');
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-[1200px] mx-auto px-4 py-12 max-md:px-2">
                <h1 className="text-[24px] text-[#1E1E1E] mb-8 max-md:text-2xl">
                    Корзина
                </h1>
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-32 h-32 mb-6 text-[#1E1E1E]/20">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M9 2L7.17 4H3C2.45 4 2 4.45 2 5C2 5.55 2.45 6 3 6H4.18L6.6 15.59C6.77 16.37 7.46 17 8.27 17H18.73C19.54 17 20.23 16.37 20.4 15.59L22.82 6H21.82M7 18C5.9 18 5 18.9 5 20C5 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18M17 18C15.9 18 15 18.9 15 20C15 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-[#1E1E1E] mb-2">
                        Ваша корзина пуста
                    </h2>
                    <p className="text-[#1E1E1E]/60 mb-8">
                        Добавьте товары из каталога
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
        <div className="max-w-[1200px] mx-auto px-4 py-8 max-md:px-2">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 max-md:flex-col max-md:items-start max-md:gap-4">
                <h1 className="text-[24px] text-[#1E1E1E] max-md:text-2xl flex">
                    Корзина <p className="self-end text-base text-[#1E1E1E80] ml-6">{cartItems.length} товара</p>
                </h1>
                {cartItems.length > 0 && (
                    <button
                        onClick={handleClearCart}
                        className="text-red-500 hover:text-red-600 transition-colors text-sm flex items-center gap-2"
                    >
                        <LuTrash2 size={16} />
                        Очистить корзину
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-md:gap-4">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-[12px] p-4 shadow-sm border border-gray-100 max-md:p-3"
                        >
                            <div className="flex gap-4 max-md:gap-3">
                                {/* Product Image */}
                                <div
                                    className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-[8px] overflow-hidden cursor-pointer hover:opacity-75 transition-opacity max-md:w-20 max-md:h-20"
                                    onClick={() => router.push(`/products/${item.id}`)}
                                >
                                    <Image
                                        src={item.image || "/cart.png"}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-contain p-2"
                                        alt={item.name}
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 flex  justify-between">
                                    <div>
                                        <h3
                                            className="text-lg line-clamp-2 font-medium text-[#272727] cursor-pointer transition-colors max-md:text-base leading-[120%] mb-3"
                                            onClick={() => router.push(`/products/${item.id}`)}
                                        >
                                            {item.article}
                                        </h3>
                                        <p className="text-sm text-[#27272799] max-md:text-xs mt-1">
                                            {item.name}
                                        </p>

                                    </div>

                                    <div className="flex flex-col items-center mt-3 max-md:flex-col max-md:items-start max-md:gap-3">
                                        {/* Quantity Controls */}
                                        <div className="border border-[#1E1E1E80] rounded-[8px] flex items-center justify-between h-[40px] px-3 gap-3 max-md:h-[36px]">
                                            <button
                                                className={`text-lg font-medium transition-colors duration-200 max-md:text-base ${item.quantity <= 1
                                                    ? "text-[#1E1E1E80] cursor-not-allowed"
                                                    : "text-[#27272733]"
                                                    }`}
                                                onClick={() =>
                                                    handleQuantityChange(item.id, item.quantity - 1)
                                                }
                                                disabled={item.quantity <= 1}
                                            >
                                                <LuMinus />
                                            </button>
                                            <span className="text-[#1E1E1E] font-medium min-w-[30px] text-center max-md:text-sm">
                                                {item.quantity}
                                            </span>
                                            <button
                                                className="text-lg font-medium text-[#27272733] transition-colors duration-200 max-md:text-base"
                                                onClick={() =>
                                                    handleQuantityChange(item.id, item.quantity + 1)
                                                }
                                            >
                                                <LuPlus />
                                            </button>
                                        </div>

                                        {/* Price and Remove */}
                                        <div className="flex items-center gap-4 max-md:w-full max-md:justify-between  h-full ">
                                            <div className="text-right">

                                                <p className="text-xl  text-[#C3974C] max-md:text-lg text-nowrap">
                                                    {formatPrice(
                                                        parseFloat(item.price) * item.quantity
                                                    )}{" "}
                                                    ₽
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-red-500 hover:text-red-600 transition-colors p-2"
                                                title="Удалить товар"
                                            >
                                                <LuTrash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[12px] p-6 shadow-sm border border-gray-100 sticky top-4 max-md:p-4">
                        <h2 className="text-xl font-semibold text-[#1E1E1E] mb-6 max-md:text-lg">
                            Итого
                        </h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-[#1E1E1E]/60">
                                <span>Товары :</span>
                                <span>{formatPrice(totalPrice)} ₽</span>
                            </div>
                            <div className="flex justify-between text-[#1E1E1E]/60">
                                <span>Доставка:</span>
                                <span>1000 ₽</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[#27272780]">
                                        Итоговая сумма
                                    </span>
                                    <span className="text-2xl text-[#272727]">
                                        {formatPrice(totalPrice)} ₽
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Button
                            text="Перейти к оформлению"
                            onClick={handleCheckout}
                            className="w-full h-[54px] mb-3 placeholder:text-[#B89B72] bg-gradient-to-br from-[#D8C19A] to-[#C3974C]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}