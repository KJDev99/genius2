'use client'
import React, { useEffect, useState } from 'react'
import BuildingCableCard from '../ui/BuildingCableCard'
import { useApiStore } from '@/store/useApiStore'

export default function BuildCableBox() {
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
    <div>
      <div className='flex justify-between items-center mt-[100px] mb-[48px] max-w-[1340px] m-auto'>
        <h2 className='text-lg text-[#27272799] leading-none tracking-minus-4 font-normal'>
          Продукция
        </h2>
        <p className='font-normal text-3xl max-w-[517px] leading-tight tracking-minus-4'>
          Кабельно-проводниковые изделия для любых задач
        </p>
        <div></div>
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
        <div className='max-w-[1340px] m-auto grid grid-cols-3 gap-[24px]'>
          {categories.map((category) => (
            <BuildingCableCard
              key={category.id}
              id={category.id}
              name={category.name}
              description={category.description}
              image={category.image}
              subCategories={category.sub_categories}
            />
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