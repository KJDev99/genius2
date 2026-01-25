import Button from '@/components/ui/Buttom'
import Product from '@/components/ui/Product'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function LovlyBox() {
  const {
    favoriteProducts,
    fetchAllFavorites,
    loading,
    error
  } = useFavoritesStore()
  const [localLoading, setLocalLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = async () => {
      setLocalLoading(true)
      await fetchAllFavorites()
      setLocalLoading(false)
    }

    loadFavorites()
  }, [])
  if (localLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[467px]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A76B] mb-4"></div>
          <p className="text-gray-600">Загрузка избранных товаров...</p>
        </div>
      </div>
    )
  }
  if (!favoriteProducts || favoriteProducts.length === 0) {
    return (
      <div className='flex flex-col h-[467px] justify-center items-center'>
        <div className='flex flex-col justify-center items-center  w-[124px] h-[97px]'>
          <Image src={'/icon/navbaricon1.svg'} width={49} height={41} alt='qww' />
          <h2 className='font-normal text-[16px] mt-[12px] leading-[22px] tracking-[-0.02em] text-center align-middle'>Нет избранных товаров</h2>
        </div>
        <Link href={'/catalog'}>
          <Button text={'Продолжить покупки'} className={`w-[342px] h-[65px] mt-[82px] rounded-[10px] bg-[linear-gradient(119.47deg,_#D8C19A_20.35%,_#C3974C_94.16%)]`} />
        </Link>
      </div>
    )
  }
  return (
    <div className="py-6 max-md:py-0">
      <h1 className="text-2xl font-bold mb-8 text-gray-800 px-4 opacity-0 max-md:hidden">
        Избранные товары ({favoriteProducts.length})
      </h1>

      <div className="grid max-md:grid-cols-2 grid-cols-3 gap-6 max-md:gap-4 px-4">
        {favoriteProducts.map((product) => (
          <Product
            key={product.id}
            id={product.id}
            isNew={product.is_active}
            isLike={true} // Bu sahifada barchasi favorite
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
    </div>
  )
}
