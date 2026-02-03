import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Map() {
  return (
    <div className='max-w-[1340px] m-auto max-sm:ml-[16px] max-sm:mr-[16px] '>
      <div className='  mt-[100px]  flex max-sm:flex-col justify-between max-md:mt-[50px]'>
        <Link href='/dastavca'>
          <h1 className=' text-[#27272799] font-normal text-[18px] leading-[100%] tracking-[-0.04em] max-sm:text-[16px]'>Доставляем</h1>
        </Link>
        <div className='w-[470px] max-md:w-full'>
          <h2 className='font-normal mb-[16px] text-[32px] leading-[32px] tracking-[-0.04em] max-sm:text-[24px] max-md:mb-4 max-md:leading-[30px] max-md:mt-6'>Поставки кабельной  продукции по всей России</h2>
          <p className='text-[#27272799]  font-normal text-[18px] leading-[140%] tracking-[-0.04em] max-sm:text-[14px] max-md:text-justify'>Благодаря многолетнему опыту и развитой транспортной логистике ваш товар будет доставлен в оптимальный срок и с наименьшими затратами.</p>
        </div>
        <div></div>
      </div>
      <div>
        <Image
          src="/mainmap.svg"
          width={2400}
          height={1200}
          alt="Map Image"
          className="w-full h-[560px] mt-[-30px] max-md:h-max max-md:mt-0"
        />
      </div>
    </div>
  )
}
