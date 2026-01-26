import Link from 'next/link'
import React from 'react'

export default function ReviewHero() {
  return (
    <div
      className='h-[293px] md:mt-[44px] max-md:h-[190px] max-md:px-4 '
      style={{
        backgroundImage: 'linear-gradient(360deg, #272727 0%, rgba(39, 39, 39, 0) 100%), url(/rewievhero.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className='pt-[128px] max-w-[1340px] m-auto max-md:pt-20'>

        <span className='font-normal flex text-[18px] leading-[120%] tracking-[-0.04em]' >
          <Link href={'/'} className='text-[#FFFFFF66]'>Главная  </Link>
          <p className='text-[#FFF]'> -  Отзывы</p>
        </span>
        <h1 className='font-normal text-[64px] leading-[100%] tracking-[-0.04em] mt-[32px] text-[#FFF] max-md:text-[32px] max-md:mt-6'>Отзывы</h1>
      </div>
    </div>
  )
}
