import Link from 'next/link'
import React from 'react'

export default function AboutHero() {
  return (
    <div className='AboutHeader  h-[293px] mt-[44px]  max-md:mt-0 max-md:h-[180px] '>
      <div className='pt-[128px] max-sm:ml-[16px] max-w-[1340px] m-auto max-md:pt-20'>

        <span className='font-normal flex text-[18px] max-sm:text-[16px] leading-[120%] tracking-[-0.04em]' >
          <Link href={'/'} className='text-[#FFFFFF66]'>Главная </Link> &nbsp;
          <p className='text-[#FFF]'> -  О нас</p>
        </span>
        <h1 className='font-normal text-[64px] leading-[100%] tracking-[-0.04em] max-sm:text-[32px] mt-[32px] text-[#FFF] max-md:mt-5'>О нас</h1>
      </div>
    </div>
  )
}
