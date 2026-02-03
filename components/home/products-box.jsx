'use client'
import React, { useEffect, useState } from 'react';
import Product from '../ui/Product';
import { useApiStore } from '@/store/useApiStore';
import Link from 'next/link';

export default function ProductsBox({ display, text = 'Наши товары' }) {
  const { getData } = useApiStore()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)

      const result = await getData('products/products/')

      // getData { success: true, data: {...} } qaytaradi
      if (result?.success && result?.data?.results) {
        // Faqat birinchi 4 ta mahsulotni olish
        setProducts(result.data.results.slice(0, 4))
      } else {
        setError('Ma\'lumot yuklanmadi')
      }

      setLoading(false)
    }

    fetchProducts()
  }, []);

  return (
    <section className="mt-[100px] px-4 sm:px-6 lg:px-8 max-md:mt-[30px]">
      <div className={`max-w-[1340px] mx-auto`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-6 mb-12 max-md:mb-6">
          <div className={`${display} text-center max-md:text-left`}>
            <p className="text-[18px] font-normal leading-tight tracking-[-0.04em] text-[#27272799] max-md:mb-2">
              {text}
            </p>
          </div>
          <h2 className={`mt-2 text-[28px] sm:text-[32px] font-normal leading-[1.3] tracking-[-0.04em]  text-[#272727] max-md:mt-0`}>
            Новые поступления
          </h2>
          <Link href="/catalog">
            <button className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-[180px] h-[42px] rounded-[12px] bg-[#DDDDDD] hover:bg-[#D0D0D0] transition max-md:hidden">
              <span className="text-[16px] font-medium">Посмотреть все</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 13.5L13.5 4.5" stroke="#272727" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.19995 4.19995H13.8V13.8" stroke="#272727" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-[1340px] mx-auto">
        {loading && (
          <div className='text-center py-10'>
            <p className='text-gray-500'>Загрузка...</p>
          </div>
        )}

        {error && (
          <div className='text-center py-10'>
            <p className='text-red-500'>Ошибка загрузки товаров</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-md:gap-4">
            {products.map((product) => (
              <Product
                key={product.id}
                id={product.id}
                isNew={product.is_active}
                isLike={product.is_favourite}
                img={product.images?.find(img => img.is_main)?.image || product.images?.[0]?.image}
                title={product.sku}
                item={product.description}
                size={product.meterages}
                price={parseFloat(product.price_per_meter)}
                manufacturer={product.manufacturer}
                stock={product.stock}
              />
            ))}
          </div>
        )}
        <Link href="/catalog">
          <button className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-[180px] h-[62px] rounded-[8px] bg-[#DDDDDD]/80  transition md:hidden max-md:mt-4 max-md:w-full">
            <span className="text-[16px] font-medium text-[#BFBFBF]">Посмотреть все</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 13.5L13.5 4.5" stroke="#BFBFBF" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4.19995 4.19995H13.8V13.8" stroke="#BFBFBF" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </Link>
        {!loading && !error && products.length === 0 && (
          <div className='text-center py-10'>
            <p className='text-gray-500'>Нет товаров для отображения</p>
          </div>
        )}
      </div>
    </section>
  );
}