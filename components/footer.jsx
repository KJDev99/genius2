import Image from 'next/image'
import { HiArrowUpRight } from 'react-icons/hi2'
import Button from './ui/Buttom'
import { FaArrowUp } from "react-icons/fa";
import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="border-t border-[#2727271A] mt-[120px] max-md:mt-[50px]">
      <div className="max-w-[1340px] mx-auto px-4 py-[48px] flex justify-between items-start max-md:flex-col max-md:py-6">
        <Button text={'Заказать звонок'} className={`w-[203px] rounded-[12px] h-[51px] bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] max-md:w-full`} />
        <div className="text-sm text-[#272727] max-md:mt-6">
          <p className="mb-[20px] font-normal text-lg leading-tight tracking-minus-6">Адрес</p>
          <p className="text-[#27272799] font-normal text-sm leading-relaxed tracking-minus-3">
            г. Москва, Проспект Мира, дом. 124
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 mt-[12px] font-normal text-lg leading-[180%] tracking-[-4%]"
          >
            Перейти на карту <HiArrowUpRight />
          </Link>
        </div>
        <div className="text-sm text-[#272727] max-md:hidden">
          <p className="mb-[16px] font-normal text-lg leading-[120%] tracking-[-6%]">Телефон</p>
          <a href="tel:+79454344343" className="inline-flex items-center gap-1 font-normal text-lg leading-[180%] tracking-[-4%]">
            +7 945 434-43-43 <HiArrowUpRight />
          </a>
        </div>
        <div className="text-sm text-[#272727] max-md:hidden">
          <p className="mb-[16px] font-normal text-lg leading-[120%] tracking-[-6%]">Почта поддержки:</p>
          <a
            href="mailto:info@geniuselectro.ru"
            className="inline-flex items-center gap-1 font-normal text-lg leading-[180%] tracking-[-4%]"
          >
            info@geniuselectro.ru <HiArrowUpRight />
          </a>
        </div>

        <div className="md:hidden max-md:grid grid-cols-2 gap-4 mt-6">
          <div className="text-sm text-[#272727]">
            <p className="mb-[16px] font-normal text-lg leading-[120%] tracking-[-6%]">Телефон</p>
            <a href="tel:+79454344343" className="inline-flex items-center gap-1 font-normal leading-[180%] tracking-[-4%]">
              +7 945 434-43-43 <HiArrowUpRight />
            </a>
          </div>
          <div className="text-sm text-[#272727]">
            <p className="mb-[16px] font-normal text-lg leading-[120%] tracking-[-6%]">Почта поддержки:</p>
            <a
              href="mailto:info@geniuselectro.ru"
              className="inline-flex items-center gap-1 font-normal  leading-[180%] tracking-[-4%]"
            >
              info@geniuselectro.ru <HiArrowUpRight />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-[#2727271A]" />
      <div className="max-w-[1340px] mx-auto px-4 py-[82px] grid grid-cols-5 gap-10 max-md:py-8 max-md:grid-cols-2">
        <div className='max-md:col-span-2 max-md:flex max-md:justify-center'>
          <Image
            src="/icon/logoblack.svg"
            width={114}
            height={81}
            alt="Genius Electro"
            className='max-md:w-[86px]'
          />
        </div>
        <div>
          <h4 className="mb-[26px] font-normal text-lg leading-[120%] tracking-[-5%] align-middle">Продукция</h4>
          <ul className="space-y-[16px] text-[#27272799] text-sm max-md:space-y-2">
            <li className='font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%]'>Силовые кабели</li>
            <li className='font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%]'>Контрольные кабели</li>
            <li className='font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%]'>Специализированные кабели</li>
          </ul>
        </div>
        <div className="mt-[47px] ">
          <ul className="space-y-[16px] text-[#27272799] text-sm">
            <li className='font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%]'>Кабели для энергетики</li>
            <li className='font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%]'>Транспортные кабели</li>
            <li className='font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%]'>Строительные кабели</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-[26px] font-normal text-lg leading-[120%] tracking-[-5%] align-middle">Компания</h4>
          <ul className="space-y-[16px] text-[#27272799] text-sm">
            <li className='font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%]'>О нас</li>
            <li className='font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%]'>Отзывы</li>
            <li className='font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%]'>Контакты</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-[26px] font-normal text-lg leading-[120%] tracking-[-5%] align-middle">Социальные сети</h4>
          <ul className="space-y-[16px] text-[#27272799] text-sm">
            <li className='font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%]'>ВКонтакте</li>
            <li className='font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%]'>WhatsApp*</li>
            <li className='font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%]'>Instagram*</li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1340px] mx-auto px-4 pb-[64px] flex justify-between text-sm text-[#27272799] max-md:flex-col max-md:items-center max-md:gap-4">
        <p className='font-normal text-sm leading-[125%] tracking-[-3%]'>© 2025 Гениус Электро. Все права защищены.</p>
        <a href="#" className="flex items-center gap-1">
          <FaArrowUp />
          Назад к началу
        </a>
      </div>
    </footer>
  )
}
