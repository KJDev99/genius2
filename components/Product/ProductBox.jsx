"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import { LuMinus, LuPlus } from "react-icons/lu";
import Button from '@/components/ui/Buttom';
import Product from '@/components/ui/Product';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';

const API_BASE_URL = 'https://api.electro.motorsdream.ru/api/v1';

export default function ProductBox() {
    const router = useRouter();
    const params = useParams();
    const productId = params.productId;

    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMeterage, setSelectedMeterage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    const { addToCart } = useCartStore();
    const { toggleFavorite, isFavorite, addLocalFavorite, removeLocalFavorite } = useFavoritesStore();

    // Tokenni tekshirish
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        setIsLoggedIn(!!token);
    }, []);

    // Fetch product details
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/products/products/${productId}/`);
                const data = await response.json();
                setProduct(data);

                // Set default meterage
                if (data.meterages?.length > 0) {
                    setSelectedMeterage(data.meterages[0].value);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    // Fetch similar products
    useEffect(() => {
        const fetchSimilarProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/products/products/${productId}/similar/`);
                const data = await response.json();
                setSimilarProducts(data.results || data);
            } catch (error) {
                console.error('Error fetching similar products:', error);
            }
        };

        if (productId) {
            fetchSimilarProducts();
        }
    }, [productId]);

    const handleQuantityChange = (type) => {
        if (type === 'increment') {
            setQuantity(prev => prev + 1);
        } else if (type === 'decrement' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        if (!isLoggedIn) {
            router.push('/auth/login');
            return;
        }

        const cartItem = {
            id: product.id,
            name: product.name,
            price: parseFloat(product.price_per_meter),
            quantity: quantity,
            meterage: selectedMeterage,
            image: product.images?.[0]?.image,
            sku: product.sku,
            article: product.sku,
            size: [selectedMeterage],
            total: parseFloat(product.price_per_meter) * quantity * (selectedMeterage || 1)
        };

        addToCart(cartItem, quantity);
        router.push('/cart');
    };

    // Toggle Favorite Logic
    const handleToggleLike = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) return;

        setFavoriteLoading(true);
        const currentIsFavorite = isFavorite(product.id);

        try {
            const result = await toggleFavorite(product.id);
            if (!result?.success) {
                // Agar API xato bersa, local state'ni sinxronlash
                if (currentIsFavorite) {
                    removeLocalFavorite(product.id);
                } else {
                    addLocalFavorite(product.id);
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setFavoriteLoading(false);
        }
    };

    const handleThumbnailClick = (index) => {
        setSelectedImageIndex(index);
    };

    const calculateTotal = () => {
        if (!product || !selectedMeterage) return 0;
        return parseFloat(product.price_per_meter) * quantity * selectedMeterage;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C3974C]"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800">Товар не найден</h2>
                    <Link href="/catalog" className="text-[#C3974C] mt-4 inline-block">
                        Вернуться в katalog
                    </Link>
                </div>
            </div>
        );
    }

    const liked = isFavorite(product.id);

    return (
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 overflow-hidden text-nowrap">
                <Link href="/" className="hover:text-gray-900">Главная</Link>
                <span>-</span>
                <Link href="/catalog" className="hover:text-gray-900">Каталог</Link>
                <span>-</span>
                <Link href={`/catalog/${product.sub_category?.main_category?.id}`} className="hover:text-gray-900">
                    {product.sub_category?.main_category?.name}
                </Link>
                <span>-</span>
                <span className="text-gray-900">{product.name}</span>
            </div>

            <h1 className="text-2xl md:text-3xl text-gray-900 mb-4">{product.name}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
                {/* Left - Images */}
                <div className="relative">
                    <div className="flex flex-col md:flex-row gap-4">
                        {product.images?.length > 1 && (
                            <div className="flex md:flex-col gap-2 order-2 md:order-1">
                                {product.images.map((img, index) => (
                                    <button
                                        key={img.id}
                                        onClick={() => handleThumbnailClick(index)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${selectedImageIndex === index ? 'border-[#C3974C]' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <Image src={img.image} alt={product.name} width={64} height={64} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex-1 order-1 md:order-2">
                            <div className="relative bg-gray-50 rounded-2xl p-8">
                                {/* Favorite button - Only shown if logged in */}
                                {isLoggedIn && (
                                    <div
                                        className={`absolute right-4 top-4 border rounded-[6px] w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-300 z-10 
                                        ${liked ? 'text-[#C9A76B] border-[#C9A76B99] bg-[#F4EDE1]' : 'text-[#C9A76B] border-[#C9A76B99] bg-white hover:bg-[#F4EDE1]'}
                                        ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={handleToggleLike}
                                    >
                                        {favoriteLoading ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#C9A76B]"></div>
                                        ) : liked ? (
                                            <IoHeart size={24} />
                                        ) : (
                                            <IoHeartOutline size={24} />
                                        )}
                                    </div>
                                )}

                                <div className="relative h-[400px] flex items-center justify-center max-md:h-[260px]">
                                    {product.images?.length > 0 ? (
                                        <Image
                                            src={product.images[selectedImageIndex].image}
                                            alt={product.name}
                                            width={500}
                                            height={500}
                                            className="object-contain max-h-full max-w-full"
                                            priority
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">Нет изображения</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right - Details */}
                <div>
                    <div className="mb-4">
                        <div className="flex justify-between items-start">
                            <p className="text-sm text-gray-500 mb-2">{product.sku}</p>
                            <p className="text-sm text-gray-500 mb-2">
                                {product.stock > 12 ? `В наличии > ${product.stock} шт.` : `Осталось ${product.stock} шт.`}
                            </p>
                        </div>
                        <p className="text-gray-600">{product.description}</p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl md:text-4xl bg-gradient-to-r from-[#D8C19A] to-[#C3974C] bg-clip-text text-transparent">
                                {parseFloat(product.price_per_meter).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽
                            </span>
                            <span className="text-lg text-gray-600">/ м</span>
                        </div>
                    </div>

                    {product.meterages?.length > 0 && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Метраж</label>
                            <div className="flex gap-3">
                                {product.meterages.filter(m => m.is_active).map((meterage) => (
                                    <button
                                        key={meterage.id}
                                        onClick={() => setSelectedMeterage(meterage.value)}
                                        className={`w-[90px] h-11 rounded-lg border-1 transition ${selectedMeterage === meterage.value ? 'bg-gradient-to-r from-[#D8C19A] to-[#C3974C] border-none text-white' : 'border-[#27272733] text-[#27272780]'}`}
                                    >
                                        {meterage.value}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mb-8">
                        <div className="flex flex-row gap-4 items-center">
                            <div className="border-2 border-gray-300 rounded-lg flex items-center justify-between px-6 py-3 w-40">
                                <button
                                    onClick={() => handleQuantityChange('decrement')}
                                    disabled={quantity <= 1}
                                    className={`text-xl ${quantity <= 1 ? 'text-gray-300' : 'text-gray-600 hover:text-[#C3974C]'}`}
                                >
                                    <LuMinus />
                                </button>
                                <span className="text-lg font-medium">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange('increment')}
                                    className="text-xl text-gray-600 hover:text-[#C3974C]"
                                >
                                    <LuPlus />
                                </button>
                            </div>
                            <p className="text-xl md:text-2xl text-[#C3974C]">
                                {calculateTotal().toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽
                            </p>
                        </div>
                        <div className="w-full md:w-[418px] h-[68px]">
                            <Button
                                onClick={handleAddToCart}
                                className="flex-1 h-auto py-3 bg-gradient-to-r from-[#D8C19A] to-[#C3974C] hover:opacity-90 transition w-full h-full mt-6"
                                text="В корзину"
                            />
                        </div>
                    </div>

                    <div className="">
                        <h3 className="text-lg text-[#272727] mb-4">Характеристики</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between ">
                                <span className="text-gray-600">Производитель</span>
                                <span className="font-medium">{product.manufacturer}</span>
                            </div>
                            {product.country_of_origin && (
                                <div className="flex justify-between ">
                                    <span className="text-gray-600">Страна-производитель</span>
                                    <span className="font-medium">{product.country_of_origin}</span>
                                </div>
                            )}
                            <div className="flex justify-between ">
                                <span className="text-gray-600">Количество жил</span>
                                <span className="font-medium">{product.number_of_cores}</span>
                            </div>
                            <div className="flex justify-between ">
                                <span className="text-gray-600">Материал проводника</span>
                                <span className="font-medium">{product.conductor_material}</span>
                            </div>
                            {product.cable_cross_section && (
                                <div className="flex justify-between ">
                                    <span className="text-gray-600">Сечение кабеля, мм²</span>
                                    <span className="font-medium">{product.cable_cross_section}</span>
                                </div>
                            )}
                            {product.color && (
                                <div className="flex justify-between ">
                                    <span className="text-gray-600">Цвет</span>
                                    <span className="font-medium">{product.color}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-16 grid grid-cols-4 max-md:grid-cols-1">
                <h2 className="text-2xl max-md:mb-4">Описание</h2>
                <div className="col-span-3 max-md:col-span-1">
                    <p className="text-[#272727] leading-relaxed max-md:leading-[130%] max-md:text-[#27272799]">{product.description}</p>
                </div>
            </div>

            {similarProducts.length > 0 && (
                <div>
                    <h2 className="text-2xl mb-6">Похожие товары</h2>
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 max-md:gap-4">
                        {similarProducts.slice(0, 4).map((item) => (
                            <div key={item.id}>
                                <Product
                                    id={item.id}
                                    isNew={new Date(item.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
                                    img={item.images?.[0]?.image || '/sec.png'}
                                    title={item.name}
                                    item={item.description}
                                    price={parseFloat(item.price_per_meter)}
                                    manufacturer={item.manufacturer}
                                    stock={item.stock}
                                    size={item.meterages?.map(m => m.value) || []}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}