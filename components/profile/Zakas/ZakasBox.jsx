import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useApiStore } from '@/store/useApiStore'

// formatPrice funksiyasini yaratamiz
const formatPrice = (price) => {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

// Buyurtma mahsuloti kartasi
const OrderProductCard = ({ product, quantity, price }) => {
  const mainImage = product?.images?.find(img => img.is_main) || product?.images?.[0]

  return (
    <Link href={`/product/${product?.id}`} className="block">
      <div
        className='p-4 h-[355px] rounded-[12px] transition-all duration-300 cursor-pointer w-full max-md:h-max max-md:p-3 '
        style={{ boxShadow: "0px 0px 4px 0px #76767626" }}
      >
        {mainImage && (
          <div className="relative w-full h-[200px] md:mb-4 max-md:h-[150px]">
            <Image
              src={mainImage.image || '/sec.png'}
              alt={product?.name || 'product'}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Mahsulot nomi */}
        <h3 className='my-2 text-sm text-[#272727] font-medium line-clamp-1 '>
          {product?.name || 'Название не указано'}
        </h3>

        {/* Tavsif */}
        <p className='text-sm leading-[18px] font-normal tracking-[-0.01em] line-clamp-2 text-[#27272799] mb-4 h-8'>
          {product?.description || 'Описание не указано'}
        </p>

        {/* Narx va miqdor */}
        <div className="md:mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="bg-gradient-to-r from-[#D8C19A] to-[#C3974C] bg-clip-text text-transparent text-lg">
                {formatPrice(price)} ₽
              </p>
              <span className="text-[#1E1E1E]/60 text-sm">× {quantity} шт.</span>
            </div>

          </div>
        </div>


      </div>
    </Link>
  )
}

export default function ZakasBox() {
  const { getDataToken } = useApiStore()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await getDataToken('orders/my-orders/')

        let allProducts = []

        if (result?.results) {
          result.results.forEach(order => {
            if (order.order_products) {
              allProducts = [...allProducts, ...order.order_products]
            }
          })
        } else if (result?.data?.results) {
          result.data.results.forEach(order => {
            if (order.order_products) {
              allProducts = [...allProducts, ...order.order_products]
            }
          })
        } else if (Array.isArray(result)) {
          result.forEach(order => {
            if (order.order_products) {
              allProducts = [...allProducts, ...order.order_products]
            }
          })
        }

        setProducts(allProducts)

      } catch (err) {
        console.error('Ошибка при загрузке заказов:', err)
        setError('Произошла ошибка при загрузке заказов')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Yuklanmoqda
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[467px]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A76B] mb-4"></div>
          <p className="text-gray-600">Загрузка товаров...</p>
        </div>
      </div>
    )
  }

  // Xatolik
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[467px]">
        <div className="text-red-500 mb-4 text-center px-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="w-[342px] h-[65px] rounded-[10px] bg-gradient-to-r from-[#D8C19A] to-[#C3974C] text-white font-medium hover:opacity-90 transition-opacity"
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  // Mahsulotlar yo'q
  if (!products || products.length === 0) {
    return (
      <div className='flex flex-col min-h-[467px] justify-center items-center'>
        <div className='flex flex-col justify-center items-center w-[154px] h-[97px]'>
          <Image
            src={'/icon/navbaricon2.svg'}
            width={49}
            height={41}
            alt='No orders icon'
            className="opacity-70"
          />
          <h2 className='font-normal text-[16px] mt-[12px] leading-[22px] tracking-[-0.02em] text-center text-gray-600'>
            Еще не заказывали товары
          </h2>
        </div>
        <Link href="/catalog" className="mt-[82px]">
          <button className="w-[342px] h-[65px] rounded-[10px] bg-gradient-to-r from-[#D8C19A] to-[#C3974C] text-white font-medium hover:opacity-90 transition-opacity">
            Продолжить покупки
          </button>
        </Link>
      </div>
    )
  }

  // Mahsulotlar mavjud - faqat gridda ko'rsatish
  return (
    <div className="mt-20 max-md:mt-5">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
        {products.map((orderProduct, index) => (
          <OrderProductCard
            key={orderProduct.id || index}
            product={orderProduct.product}
            quantity={orderProduct.quantity}
            price={orderProduct.price}
          />
        ))}
      </div>
    </div>
  )
}