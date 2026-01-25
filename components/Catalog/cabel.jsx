'use client'
import { useApiStore } from '@/store/useApiStore'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function Cabel() {
  const { getData } = useApiStore()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [visibleCount, setVisibleCount] = useState(4) // Boshlang'ich ko'rinadigan son

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      setError(null)

      const result = await getData('products/main-categories/')

      if (result?.success && result?.data) {
        setCategories(result.data)
      } else {
        setError('Ma\'lumot yuklanmadi')
      }

      setLoading(false)
    }

    fetchCategories()
  }, [])

  // "Посмотреть все" tugmasini bosganda
  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 4)
  }

  // "Посмотреть все" tugmasini yashirish/ko'rsatish
  const shouldShowButton = visibleCount < categories.length

  return (
    <div className='mt-[100px] max-w-[1340px] mx-auto max-md:mt-[50px] max-md:px-4'>
      <div className="">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-12">
          <div className="text-left">
            <p className="font-normal text-[32px] leading-[42px] tracking-[-0.04em]  max-md:text-[24px] text-[#272727] max-md:leading-[30px]">
              Кабельно-проводниковые изделия для любых задач
            </p>
          </div>

          {/* Desktop uchun "Посмотреть все" tugmasi */}
          <button
            onClick={handleShowMore}
            className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-[180px] h-[42px] rounded-[12px] bg-[#DDDDDD] hover:bg-[#D0D0D0] transition max-md:hidden"
            disabled={!shouldShowButton}
          >
            <span className="text-[16px] font-medium">Посмотреть все</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 13.5L13.5 4.5" stroke="#272727" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4.19995 4.19995H13.8V13.8" stroke="#272727" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {loading && (
        <div className='max-w-[1340px] m-auto text-center py-10'>
          <p className='text-gray-500'>Загрузка...</p>
        </div>
      )}

      {error && (
        <div className='max-w-[1340px] m-auto text-center py-10'>
          <p className='text-red-500'>Ошибка загрузки данных</p>
        </div>
      )}

      {!loading && !error && categories.length > 0 && (
        <>
          <div className='grid grid-cols-4 gap-[24px] max-md:grid-cols-2 max-md:gap-4'>
            {categories.slice(0, visibleCount).map((category) => (
              <Link
                href={`/catalog-details/${category.id}`}
                key={category.id}
                className='p-[32px] w-[317px] h-[306px] shadow-[0_0_4px_0_rgba(118,118,118,0.15)] rounded-[16px] box-shadow: 0px 0px 4px 0px #76767626 max-md:w-full max-md:p-4 max-md:h-auto flex flex-col items-center justify-center max-md:rounded-[12px]'
              >
                <Image
                  className=' mb-6 max-md:w-full max-md:mb-2'
                  src={category.image || '/sec11.png'}
                  width={300}
                  height={183}
                  alt={category.name || 'Категория'}
                />
                <h2 className=' font-normal text-lg leading-[100%] tracking-[-0.04em] text-[#272727] max-md:text-sm'>
                  {category.name}
                </h2>
              </Link>
            ))}
          </div>

          {/* Mobile uchun "Посмотреть все" tugmasi */}
          {shouldShowButton && (
            <button
              onClick={handleShowMore}
              className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-[180px] h-[62px] rounded-[8px] bg-[#DDDDDD]/80 hover:bg-[#D0D0D0]/80 transition md:hidden max-md:mt-4 max-md:w-full"
            >
              <span className="text-[16px] font-medium text-[#BFBFBF]">Посмотреть все</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 13.5L13.5 4.5" stroke="#BFBFBF" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.19995 4.19995H13.8V13.8" stroke="#BFBFBF" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

        </>
      )}

      {!loading && !error && categories.length === 0 && (
        <div className='max-w-[1340px] m-auto text-center py-10'>
          <p className='text-gray-500'>Нет данных для отображения</p>
        </div>
      )}
    </div>
  )
}