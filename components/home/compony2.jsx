import Image from 'next/image'
import React from 'react'

export default function Compony2() {
  return (
    <div>
      <div className="mt-[32px] max-sm:ml-[16px] max-sm:mr-[16px] relative bg-[url('/sec10.png')] bg-cover bg-center h-[500px] max-md:h-[360px] max-w-[1340px] m-auto max-sm:rounded-[24px] rounded-[32px] overflow-hidden max-md:mt-8">

        <Image
          src="/sec3bg.png"
          alt="overlay"
          fill
          className="absolute inset-0 object-cover"
        />
        <div className=' absolute max-sm:flex max-sm:flex-col gap-[24px] max-sm:text-center bottom-[48px] md:right-[48px]  flex max-md:px-6 max-md:bottom-6 max-md:gap-4'>

          <p className='  font-normal w-[393px] max-sm:w-full max-sm:text-[14px] text-[18px] leading-[135%] max-md:leading-[130%] max-md:text-justify tracking-[-0.04em] text-[#FFFFFF]'>Собственное конструкторское бюро позволяет нам разрабатывать уникальные инженерные решения под конкретные задачи заказчика. Каждый проект проходит многоступенчатый контроль качества.</p>
          <p className='  font-normal w-[393px] max-sm:w-full max-sm:text-[14px] text-[18px] leading-[135%] max-md:leading-[130%] max-md:text-justify tracking-[-0.04em] text-[#FFFFFF]'>Мы работаем с ведущими промышленными предприятиями, энергетическими компаниями и строительными организациями, обеспечивая стабильные поставки и профессиональную техническую поддержку.</p>
        </div>
      </div>
      <div className='max-sm:ml-[16px] max-sm:mr-[16px] sm:flex sm:justify-center grid grid-cols-2  sm:gap-[100px] gap-[13px] mt-[32px] sm:mt-[64px]'>
        <div>
          <h2 className="font-inter font-normal text-[40px] sm:text-[82px] md:leading-[82px] tracking-[0]">2015</h2>
          <p className="font-inter font-normal text-[16px] sm:text-[18px] leading-none tracking-[-0.04em] text-[#27272799] sm:mt-[24px] mt-[6px]">Год создания <br className='md:hidden' /> компании</p>
        </div>
        <div>
          <h2 className="font-inter font-normal text-[40px] sm:text-[82px] md:leading-[82px] tracking-[0]">14 600+</h2>
          <p className="font-inter font-normal text-[16px] sm:text-[18px] leading-none tracking-[-0.04em] text-[#27272799] sm:mt-[24px] mt-[6px]">Километров кабеля <br className='md:hidden' /> создано</p>
        </div>
        <div>
          <h2 className="font-inter font-normal text-[40px] sm:text-[82px] md:leading-[82px] tracking-[0]">500+</h2>
          <p className="font-inter font-normal text-[16px] sm:text-[18px] leading-none tracking-[-0.04em] text-[#27272799] sm:mt-[24px] mt-[6px]">Клиенты</p>
        </div>
      </div>
    </div>
  )
}
