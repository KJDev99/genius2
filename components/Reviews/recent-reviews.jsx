'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const REVIEWS_DATA = [
  {
    id: 1,
    image: '/sec12.png',
    text1: "Покупал кабели в магазине Genius Electro — остался полностью доволен. Качество сразу чувствуется: плотная изоляция, аккуратные разъёмы, ничего не люфтит и не выглядит «дешёво».",
    text2: "Отдельно отмечу сборку — видно, что кабели сделаны с расчётом на долгую эксплуатацию, а не «на один раз».",
    author: "Антон Антонов",
    position: "CEO, XYZ Group"
  },
  {
    id: 2,
    image: '/sec12.png', // Bu yerda boshqa rasm bo'lsa o'zgartirishingiz mumkin
    text1: "Заказывали партию оборудования для офиса. Все пришло вовремя и в идеальном состоянии. Сервис на высшем уровне, консультанты помогли подобрать именно то, что нужно.",
    text2: "Рекомендую Genius Electro как надежного партнера для бизнеса. Будем заказывать еще!",
    author: "Мария Иванова",
    position: "Project Manager, ABC Tech"
  }
]

export default function RecentReviews() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0) // -1 chapga, 1 o'ngga

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % REVIEWS_DATA.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + REVIEWS_DATA.length) % REVIEWS_DATA.length)
  }

  const currentReview = REVIEWS_DATA[currentIndex]

  // Animatsiya variantlari
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  }

  return (
    <div className='max-w-[1340px] m-auto px-4 overflow-hidden'>
      <h2 className='text-[#27272799] mt-[100px] mb-[48px] max-md:mt-[50px] max-md:mb-8 font-normal text-[24px] leading-[100%] tracking-[-0.04em]'>
        Последние отзывы
      </h2>

      <div className='grid grid-cols-2 max-md:flex max-md:flex-col gap-[24px] items-center'>
        {/* Rasm qismi animatsiya bilan */}
        <div className='relative w-full aspect-[613/520]'>
          <AnimatePresence mode='wait' custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className='w-full h-full'
            >
              <Image
                src={currentReview.image}
                fill
                className='object-contain'
                alt='review image'
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className='flex flex-col justify-between h-full py-4'>
          <div className='min-h-[250px]'>
            <AnimatePresence mode='wait' custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <p className='font-normal text-[24px] leading-[130%] tracking-[-0.04em] max-md:text-sm'>
                  {currentReview.text1}
                </p>
                <br />
                <p className='font-normal text-[24px] leading-[130%] tracking-[-0.04em] max-md:text-sm'>
                  {currentReview.text2}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-[64px] max-md:mt-8">
            {/* Muallif qismi */}
            <div className="flex items-center gap-[16px]">
              <div className="w-[57px] h-[57px] rounded-full bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] max-md:w-11 max-md:h-11 shrink-0" />
              <div>
                <h3 className="font-normal text-[24px] leading-[120%] tracking-[-0.06em] max-md:text-[16px] text-[#272727]">
                  {currentReview.author}
                </h3>
                <p className="font-normal text-[18px] leading-[24px] tracking-[-0.06em] text-[#27272766] max-md:text-sm">
                  {currentReview.position}
                </p>
              </div>
            </div>

            {/* Tugmalar */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-[#F3F3F3] flex items-center justify-center transition-all duration-300 hover:bg-[#e5e5e5] active:scale-90 text-[#272727]"
                aria-label="Previous review"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] flex items-center justify-center transition-all duration-300 hover:opacity-80 active:scale-90 text-white"
                aria-label="Next review"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}