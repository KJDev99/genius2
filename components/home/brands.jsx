'use client';
import Image from 'next/image';
import React, { useRef, useEffect, useState } from 'react';
import { LiaArrowLeftSolid, LiaArrowRightSolid } from "react-icons/lia";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useApiStore } from '@/store/useApiStore';

export default function Brands() {
  const scrollContainerRef = useRef(null);
  const { getData } = useApiStore()
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true)
      setError(null)

      const result = await getData('sites/partners/')

      // getData { success: true, data: [...] } qaytaradi
      if (result?.success && result?.data && Array.isArray(result.data)) {
        setPartners(result.data)
      } else {
        setError('Ma\'lumot yuklanmadi')
      }

      setLoading(false)
    }

    fetchPartners()
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -227,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 227,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="max-w-[1340px] mx-auto mt-16 px-4 max-md:mt-8">
      {loading && (
        <div className='text-center py-10'>
          <p className='text-gray-500'>Загрузка партнеров...</p>
        </div>
      )}

      {error && (
        <div className='text-center py-10'>
          <p className='text-red-500'>Ошибка загрузки партнеров</p>
        </div>
      )}

      {!loading && !error && partners.length > 0 && (
        <>
          <div className="flex items-center justify-between gap-x-4">
            <button
              onClick={scrollLeft}
              className="hidden md:flex h-12 w-12 shrink-0 justify-center items-center rounded-full bg-gray-400 hover:bg-gray-500 z-10 transition-colors"
              aria-label="Oldingi brendlar"
            >
              <LiaArrowLeftSolid size={28} className="text-white" />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {partners.map((partner, index) => (
                <div
                  key={partner.id}
                  className={`w-[203px] h-[127px] flex justify-center items-center rounded-[16px] flex-shrink-0 snap-center hover:bg-gradient-to-br hover:from-[#D8C19A] hover:to-[#C3974C] bg-[#DDDDDD] transition-all
                    }`}
                >
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <Image
                      src={partner.image}
                      width={130}
                      height={50}
                      alt={`Partner ${partner.id}`}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.target.src = '/placeholder-brand.png';
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={scrollRight}
              className="hidden md:flex shrink-0 h-12 w-12 justify-center items-center rounded-full bg-gradient-to-br from-[#D8C19A] to-[#C3974C] hover:opacity-90 z-10 transition-opacity"
              aria-label="Keyingi brendlar"
            >
              <LiaArrowRightSolid size={28} className="text-white" />
            </button>
          </div>

          {/* Mobile tugmalari */}
          <div className="flex justify-center gap-[16px] mt-4 md:hidden">
            <button
              onClick={scrollLeft}
              className="h-12 w-12 flex justify-center items-center rounded-full bg-[#76767626] transition-colors cursor-pointer"
              aria-label="Oldingi brendlar"
            >
              <MdOutlineKeyboardArrowLeft size={28} className="text-[#27272799]" />
            </button>
            <button
              onClick={scrollRight}
              className="h-12 w-12 flex justify-center items-center rounded-full bg-gradient-to-br from-[#D8C19A] to-[#C3974C] hover:opacity-90 transition-opacity cursor-pointer"
              aria-label="Keyingi brendlar"
            >
              <MdOutlineKeyboardArrowRight size={28} className="text-[#272727]" />
            </button>
          </div>
        </>
      )}

      {!loading && !error && partners.length === 0 && (
        <div className='text-center py-10'>
          <p className='text-gray-500'>Партнеры не найдены</p>
        </div>
      )}

      {/* Scrollbar yashirish uchun CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}