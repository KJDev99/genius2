"use client";
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { IoHeartOutline, IoHeart } from 'react-icons/io5'
import { LuMinus, LuPlus } from "react-icons/lu";
import Button from './Buttom';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Product({
    id,
    isNew,
    isLike,
    img,
    title,
    item,
    size = [],
    price,
    manufacturer,
    stock,
    initialQuantity = 1,
    buttonText = "В корзину",
    onClick
}) {
    const [quantity, setQuantity] = useState(initialQuantity)
    const [isLiked, setIsLiked] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [loading, setLoading] = useState(false)
    const { addToCart } = useCartStore()
    const { toggleFavorite, isFavorite, addLocalFavorite, removeLocalFavorite } = useFavoritesStore()
    const router = useRouter()

    // Komponent mount bo'lganda like holatini tekshirish
    useEffect(() => {
        setIsLiked(isFavorite(id));
    }, [id, isFavorite]);

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    const handleIncrement = () => {
        setQuantity(quantity + 1)
    }

    const toggleLike = async () => {
        setLoading(true);
        try {
            const result = await toggleFavorite(id);

            if (result?.success) {
                // Muvaffaqiyatli bo'lsa, local state yangilash
                setIsLiked(!isLiked);

                // Agar API muvaffaqiyatsiz bo'lsa, local storage'ni yangilash
                if (!result.success) {
                    if (isLiked) {
                        removeLocalFavorite(id);
                    } else {
                        addLocalFavorite(id);
                    }
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            // Xato bo'lsa ham UI yangilash
            setIsLiked(!isLiked);
            if (isLiked) {
                removeLocalFavorite(id);
            } else {
                addLocalFavorite(id);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleAddToCart = () => {
        const cartItem = {
            id,
            name: title,
            price,
            article: item,
            image: img,
            size: size,
            quantity: quantity
        }

        addToCart(cartItem, quantity)

        if (onClick) {
            onClick({ id, title, item, quantity, price })
        } else {
            router.push('/cart')
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price)
    }

    return (
        <Link href={`/product/${id}`}>
            <div
                className='p-4 relative rounded-[12px] h-[481px] transition-all duration-300 cursor-pointer w-full max-md:p-2 max-md:rounded-[8px] max-md:h-max max-md:w-full'
                style={{ boxShadow: "0px 0px 4px 0px #76767626" }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {isNew && (
                    <div className="absolute text-[#C9A76B] py-2 px-4.5 max-md:py-1 max-md:px-4 border border-[#C9A76B99] rounded-[6px] max-md:rounded-[4px] bg-[#F4EDE1] text-sm z-10 max-md:text-[10px]">
                        Новинка
                    </div>
                )}

                <div
                    className={`absolute right-4 max-md:right-2 border rounded-[6px] max-md:rounded-[4px] max-md:w-5.5 max-md:h-5.5 w-8 h-8 flex items-center justify-center cursor-pointer transition-all duration-300 z-10 ${isLiked
                        ? 'text-[#C9A76B] border-[#C9A76B99] bg-[#F4EDE1]'
                        : 'text-[#C9A76B] border-[#C9A76B99] hover:bg-[#F4EDE1] bg-white'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!loading) toggleLike();
                    }}
                    title={isLiked ? 'Удалить из избранного' : 'Добавить в избранное'}
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#C9A76B]"></div>
                    ) : isLiked ? (
                        <IoHeart className='max-md:text-sm' />
                    ) : (
                        <IoHeartOutline className='max-md:text-sm' />
                    )}
                </div>

                <Image
                    src={img || '/sec.png'}
                    width={230}
                    height={230}
                    className='transition-transform duration-300 w-full h-[230px] object-contain max-md:h-[150px]'
                    alt={item || 'product'}
                />

                <h3 className='my-4 text-[14px] text-[#272727] max-md:mt-2 max-md:text-[10px] max-md:mb-2'>
                    {title || 'LC1-C5E04-157'}
                </h3>
                <p className='text-[18px] leading-[24px] font-normal tracking-[-0.01em] line-clamp-2 max-md:text-[12px] text-[#27272799] max-md:leading-[14px]'>
                    {item || 'ITK Витая пара U/UTP 5E 4х2х0,52 нг(А)-FRLSоранж. (305м)'}
                </p>

                <div className="mt-4 mb-4 text-lg flex max-md:mt-4 max-md:mb-3 max-md:text-sm">
                    <div className="flex items-center">
                        <p className="
                        bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)]
                        bg-clip-text
                        text-transparent
                        font-medium
                    ">
                            {formatPrice(price || 0)} ₽
                        </p>
                        &nbsp; / &nbsp;
                        <p className="text-[#1E1E1E]/60">
                            {size && Array.isArray(size) && size.length > 0 ? 'м' : 'шт'}
                        </p>
                    </div>
                </div>

                <div className="flex gap-x-3 h-[54px] max-md:h-[33px] max-md:gap-x-2">
                    {
                        buttonText === 'В корзину' &&
                        <div className="border border-[#1E1E1E80] rounded-[10px] flex items-center justify-between h-[54px] max-md:h-[33px] max-md:rounded-[6px] grow-1 px-4 max-md:gap-x-2 max-md:px-2">
                            <button
                                className={`text-xl font-medium transition-colors duration-200 max-md:text-base ${quantity <= 1 ? 'text-[#1E1E1E80] cursor-not-allowed' : 'text-[#1E1E1E80] hover:text-[#2C5AA0]'
                                    }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDecrement();
                                }}
                                disabled={quantity <= 1}
                            >
                                <LuMinus />
                            </button>
                            <span className="text-[#1E1E1E] font-medium flex items-center max-md:text-[8px]">{quantity}</span>
                            <button
                                className="text-xl font-medium text-[#1E1E1E80] hover:text-[#2C5AA0] transition-colors duration-200 max-md:text-base"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleIncrement();
                                }}
                            >
                                <LuPlus />
                            </button>
                        </div>
                    }

                    <Button
                        className={`h-[54px] w-[135px] transition-all duration-300 max-md:h-[33px] max-md:w-[77px] max-md:rounded-[6px] max-md:text-[8px] ${isHovered
                            ? 'bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] !text-white'
                            : 'bg-[#EFEFEF] !text-[#8E8E8E]'
                            } ${buttonText !== 'В корзину' ? 'grow' : 'grow-0'}`}

                        text={buttonText || 'В корзину'}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart();
                        }}
                    />
                </div>
            </div>
        </Link>
    )
}