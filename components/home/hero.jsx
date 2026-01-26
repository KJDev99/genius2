import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React from 'react';

export default function Hero() {
  return (
    <div className="mt-[32px] px-4 lg:px-8 max-md:mt-4">
      <div
        className="relative max-w-[1340px] mx-auto h-[761px] rounded-[32px] overflow-hidden 
                   bg-cover bg-center bg-[url('/headerimg.png')]
                   flex flex-col justify-center items-center
                   text-center
                   sm:h-[700px] md:h-[761px] max-sm:h-[736px]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#40404080] to-[rgba(67,67,67,0.2)]"></div>
        <div className="relative z-10 px-4 max-w-full max-md:w-full">
          <p className="font-normal text-[18px] max-sm:text-[16px] leading-[120%] tracking-[-0.04em] text-white/60 mb-8">
            Работаем с 2015 года
          </p>
          <h1 className="font-normal text-[40px] max-sm:text-[28px] sm:text-[48px] md:text-[56px] lg:text-[60px] leading-[110%] tracking-[-0.04em] text-white mx-auto max-w-[682px]">
            Конструкторское бюро<br />
            кабельной продукции
          </h1>
          <div className="relative mt-12 mx-auto max-w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Найдите все, что вам нужно"
                className="w-full max-w-[658px] h-[72px] p-3 pr-12 pl-6 text-[20px] placeholder:text-[#B89B72] 
                 rounded-[12px] focus:outline-none text-white max-md:text-sm max-md:h-[60px]"
                style={{
                  background: '#EEDDC11A',
                  border: '1px solid #C3974C',
                }}
              />

              {/* Search ikonkasi – input ustida joylashadi */}
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 
                 bg-gradient-to-br from-[#D8C19A] to-[#C3974C] 
                 rounded-[12px] w-[36px] h-[36px] sm:w-[56px] sm:h-[56px] 
                 flex items-center justify-center cursor-pointer shadow-md z-10 max-md:rounded-[8px]"
              >
                <MagnifyingGlassIcon className="w-6 h-6 text-[#272727] max-md:w-4 max-md:h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}