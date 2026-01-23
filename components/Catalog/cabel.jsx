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
  return (
    <div className='mt-[100px] max-w-[1340px] mx-auto'>
      <div className="">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-12">
          <div className="text-center sm:text-left">
            <p className="font-normal text-[32px] leading-[42px] tracking-[-0.04em]  ">
              Кабельно-проводниковые изделия для любых задач
            </p>
          </div>

          {/* <button className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-[180px] h-[42px] rounded-[12px] bg-[#DDDDDD] hover:bg-[#D0D0D0] transition">
            <span className="text-[16px] font-medium">Посмотреть все</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 13.5L13.5 4.5" stroke="#272727" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4.19995 4.19995H13.8V13.8" stroke="#272727" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button> */}
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
        <div className='grid grid-cols-4 gap-[24px]'>
          {categories.slice(0, 4).map((category) => (
            <Link href={`/catalog-details/${category.id}`} key={category.id} className='p-[32px] w-[317px] h-[306px] shadow-[0_0_4px_0_rgba(118,118,118,0.15)] rounded-[16px] box-shadow: 0px 0px 4px 0px #76767626;
'>
              <Image className=' mb-6' src={category.image || '/sec11.png'} width={300} height={183} alt='qa' />
              <h2 className=' font-normal text-lg leading-[100%] tracking-[-0.04em] text-[#272727]'>{category.name}</h2>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && categories.length === 0 && (
        <div className='max-w-[1340px] m-auto text-center py-10'>
          <p className='text-gray-500'>Нет данных для отображения</p>
        </div>
      )}

    </div>
  )
}
