'use client'
import React, { useEffect, useState, useRef } from 'react'
import BuildingCableCard from '../ui/BuildingCableCard'
import { useApiStore } from '@/store/useApiStore'
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md'

export default function BuildCableBox() {
  const { getData } = useApiStore()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef(null)
  const cardRefs = useRef([])

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

  // Kartalarni markazlashtirish uchun hisob-kitob
  useEffect(() => {
    const updateScrollPosition = () => {
      if (!scrollContainerRef.current || categories.length === 0) return

      const container = scrollContainerRef.current
      const containerWidth = container.clientWidth

      // Kartaning kengligini hisoblash (ekranning 85% dan kam)
      const cardWidth = Math.min(containerWidth * 0.85, 400)

      // Markazlashtirish uchun bo'sh joy
      const margin = (containerWidth - cardWidth) / 2

      // Har bir kartaga inline style berish
      cardRefs.current.forEach(card => {
        if (card) {
          card.style.width = `${cardWidth}px`
          card.style.marginLeft = `${margin}px`
          card.style.marginRight = `${margin}px`
        }
      })
    }

    updateScrollPosition()
    window.addEventListener('resize', updateScrollPosition)

    return () => {
      window.removeEventListener('resize', updateScrollPosition)
    }
  }, [categories])

  const scrollToIndex = (index) => {
    if (!scrollContainerRef.current || categories.length === 0) return

    const container = scrollContainerRef.current
    const containerWidth = container.clientWidth
    const cardWidth = Math.min(containerWidth * 0.85, 400)
    const margin = (containerWidth - cardWidth) / 2
    const totalCardWidth = cardWidth + margin * 2

    const scrollPosition = index * totalCardWidth
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    })
    setCurrentIndex(index)
  }

  const scrollLeft = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1)
    }
  }

  const scrollRight = () => {
    if (currentIndex < categories.length - 1) {
      scrollToIndex(currentIndex + 1)
    }
  }

  // Scroll holatini kuzatish
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const containerWidth = container.clientWidth
      const cardWidth = Math.min(containerWidth * 0.85, 400)
      const margin = (containerWidth - cardWidth) / 2
      const totalCardWidth = cardWidth + margin * 2

      const newIndex = Math.round(container.scrollLeft / totalCardWidth)
      setCurrentIndex(Math.min(Math.max(newIndex, 0), categories.length - 1))
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [categories.length])

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center px-4 mt-[100px] mb-[48px] max-w-[1340px] m-auto">
        <h2 className="text-[#27272799] sm:text-lg text-base leading-none tracking-[-0.04em] font-normal">
          Продукция
        </h2>
        <p className="font-normal text-2xl sm:text-3xl max-w-[517px] leading-tight tracking-[-0.04em] mt-4 sm:mt-0">
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
        <>
          <div
            ref={scrollContainerRef}
            className="max-w-[1340px] max-md:overflow-x-hidden relative m-auto md:grid md:grid-cols-3 gap-[24px] max-md:flex max-md:snap-x max-md:snap-mandatory pb-4 hide-scrollbar"
          >
            {categories.map((category, index) => (
              <div
                key={category.id}
                ref={el => cardRefs.current[index] = el}
                className="max-md:snap-center max-md:shrink-0 md:mx-0!"
              >
                <BuildingCableCard
                  id={category.id}
                  name={category.name}
                  description={category.description}
                  image={category.image}
                  subCategories={category.sub_categories}
                />
              </div>
            ))}
          </div>

          {/* Faqat mobil qurilmalarda korinadigan tugmalar */}
          <div className="flex justify-center items-center gap-6 mt-8 md:hidden">
            <button
              onClick={scrollLeft}
              disabled={currentIndex === 0}
              className={`
                h-12 w-12 flex justify-center items-center rounded-full 
                transition-all duration-300 disabled:cursor-not-allowed
                ${currentIndex === 0
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'bg-gradient-to-br from-[#D8C19A] to-[#C3974C] hover:opacity-90 cursor-pointer shadow-lg'
                }
              `}
              aria-label="Oldingi kategoriya"
            >
              <MdOutlineKeyboardArrowLeft
                size={28}
                className={currentIndex === 0 ? "text-gray-400" : "text-white"}
              />
            </button>


            <button
              onClick={scrollRight}
              disabled={currentIndex === categories.length - 1}
              className={`
                h-12 w-12 flex justify-center items-center rounded-full 
                transition-all duration-300 disabled:cursor-not-allowed
                ${currentIndex === categories.length - 1
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'bg-gradient-to-br from-[#D8C19A] to-[#C3974C] hover:opacity-90 cursor-pointer shadow-lg'
                }
              `}
              aria-label="Keyingi kategoriya"
            >
              <MdOutlineKeyboardArrowRight
                size={28}
                className={currentIndex === categories.length - 1 ? "text-gray-400" : "text-white"}
              />
            </button>
          </div>
        </>
      )}

      {!loading && !error && categories.length === 0 && (
        <div className='max-w-[1340px] m-auto text-center py-10'>
          <p className='text-gray-500'>Нет данных для отображения</p>
        </div>
      )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 768px) {
          /* Scroll uchun CSS Snap */
          [class*="max-md:snap-x"] {
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }
          
          [class*="max-md:snap-center"] {
            scroll-snap-align: center;
          }
        }
      `}</style>
    </div>
  )
}