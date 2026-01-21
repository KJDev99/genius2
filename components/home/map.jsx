import Image from 'next/image'
import React from 'react'

export default function Map() {
  return (
    <div className='max-w-[1340px] m-auto max-sm:ml-[16px] max-sm:mr-[16px]'>
      <div className='  mt-[100px]  flex max-sm:flex-col justify-between'>
        <div>
          <h1 className=' text-[#27272799] font-normal text-[18px] leading-[100%] tracking-[-0.04em] max-sm:text-[16px]'>Доставляем</h1>
        </div>
        <div className='w-[470px]'>
          <h2 className='font-normal mb-[24px] text-[32px] leading-[42px] tracking-[-0.04em] max-sm:text-[24px]'>Поставки кабельной <br className='md:hidden' /> продукции по всей России</h2>
          <p className='text-[#27272799]  font-normal text-[18px] leading-[140%] tracking-[-0.04em] max-sm:text-[14px]'>Благодаря многолетнему опыту и развитой <br className='md:hidden' /> транспортной логистике ваш товар будет доставлен<br className='md:hidden' /> в оптимальный срок и с наименьшими затратами.</p>
        </div>
        <div></div>
      </div>
      <div>
        <Image
          src="/map.png"
          width={500}
          height={300}
          alt="Map Image"
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  )
}
