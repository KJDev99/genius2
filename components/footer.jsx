'use client'
import Image from 'next/image'
import { HiArrowUpRight } from 'react-icons/hi2'
import Button from './ui/Buttom'
import { FaArrowUp } from "react-icons/fa";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useApiStore } from '@/store/useApiStore';
import { AnimatePresence } from 'framer-motion';
import PopUpModal from './pop-up-modal';

export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getData } = useApiStore();
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const result = await getData('products/main-categories/');

        if (result?.success && result?.data) {
          // Faqat 6 ta kategoriya olish
          const firstSixCategories = result.data.slice(0, 6);
          setCategories(firstSixCategories);
        }
      } catch (error) {
        console.error("Kategoriyalarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [getData]);

  // Kategoriyalarni ikkiga bo'lish (3+3)
  const firstHalfCategories = categories.slice(0, 3);
  const secondHalfCategories = categories.slice(3, 6);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="border-t border-[#2727271A] mt-[120px] max-md:mt-[50px]">
      <div className="max-w-[1340px] mx-auto px-4 py-[48px] flex justify-between items-start max-md:flex-col max-md:py-6">
        <Button
          onClick={() => setOpen(true)}
          text={'Заказать звонок'}
          className={`w-[203px] rounded-[12px] h-[51px] bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] max-md:w-full`}
        />

        <div className="text-sm text-[#272727] max-md:mt-6">
          <p className="mb-[20px] font-normal text-lg leading-tight tracking-minus-6">Адрес</p>
          <p className="text-[#27272799] font-normal text-sm leading-relaxed tracking-minus-3">
            г. Москва, Проспект Мира, дом. 124
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 mt-[12px] font-normal text-lg leading-[180%] tracking-[-4%] hover:text-[#C3974C] transition-colors"
          >
            Перейти на карту <HiArrowUpRight />
          </Link>
        </div>

        <div className="text-sm text-[#272727] max-md:hidden">
          <p className="mb-[16px] font-normal text-lg leading-[120%] tracking-[-6%]">Телефон</p>
          <a
            href="tel:+79454344343"
            className="inline-flex items-center gap-1 font-normal text-lg leading-[180%] tracking-[-4%] hover:text-[#C3974C] transition-colors"
          >
            +7 945 434-43-43 <HiArrowUpRight />
          </a>
        </div>

        <div className="text-sm text-[#272727] max-md:hidden">
          <p className="mb-[16px] font-normal text-lg leading-[120%] tracking-[-6%]">Почта поддержки</p>
          <a
            href="mailto:info@geniuselectro.ru"
            className="inline-flex items-center gap-1 font-normal text-lg leading-[180%] tracking-[-4%] hover:text-[#C3974C] transition-colors"
          >
            info@geniuselectro.ru <HiArrowUpRight />
          </a>
        </div>

        {/* Mobile contact info */}
        <div className="md:hidden max-md:grid grid-cols-2 gap-4 mt-6">
          <div className="text-sm text-[#272727]">
            <p className="mb-[16px] font-normal text-lg leading-[120%] tracking-[-6%]">Телефон</p>
            <a
              href="tel:+79454344343"
              className="inline-flex items-center gap-1 font-normal leading-[180%] tracking-[-4%] hover:text-[#C3974C] transition-colors"
            >
              +7 945 434-43-43 <HiArrowUpRight />
            </a>
          </div>
          <div className="text-sm text-[#272727]">
            <p className="mb-[16px] font-normal text-lg leading-[120%] tracking-[-6%]">Почта поддержки</p>
            <a
              href="mailto:info@geniuselectro.ru"
              className="inline-flex items-center gap-1 font-normal leading-[180%] tracking-[-4%] hover:text-[#C3974C] transition-colors"
            >
              info@geniuselectro.ru <HiArrowUpRight />
            </a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && <PopUpModal setOpen={setOpen} />}
      </AnimatePresence>
      <div className="border-t border-[#2727271A]" />

      <div className="max-w-[1340px] mx-auto px-4 py-[82px] grid grid-cols-5 gap-10 max-md:py-8 max-md:grid-cols-2">
        {/* Logo */}
        <div className='max-md:col-span-2 max-md:flex max-md:justify-center max-md:mb-4'>
          <Link href="/">
            <Image
              src="/icon/logoblack.svg"
              width={114}
              height={81}
              alt="Genius Electro"
              className='max-md:w-[86px] hover:opacity-90 transition-opacity'
            />
          </Link>
        </div>

        {/* Продукция section - Backenddan kelgan kategoriyalar */}
        <div>
          <h4 className="mb-[26px] font-normal text-lg leading-[120%] tracking-[-5%] align-middle">Продукция</h4>

          {loading ? (
            <div className="space-y-[16px]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <>
              {/* First 3 categories */}
              <ul className="space-y-[16px] text-[#27272799] text-sm max-md:space-y-2">
                {firstHalfCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/catalog-details/${category.id}`}
                      className="font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%] hover:text-[#C3974C] transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-[#27272799] text-sm">Нет доступных категорий</p>
          )}
        </div>

        {/* Second part of Продукция */}
        <div className="mt-[47px] max-md:mt-0">
          {loading ? (
            <div className="space-y-[16px]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : categories.length > 3 && (
            <ul className="space-y-[16px] text-[#27272799] text-sm max-md:space-y-2">
              {secondHalfCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/catalog-details/${category.id}`}
                    className="font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%] hover:text-[#C3974C] transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Компания section */}
        <div>
          <h4 className="mb-[26px] font-normal text-lg leading-[120%] tracking-[-5%] align-middle">Компания</h4>
          <ul className="space-y-[16px] text-[#27272799] text-sm max-md:space-y-2">
            <li>
              <Link
                href="/about"
                className="font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%] hover:text-[#C3974C] transition-colors"
              >
                О нас
              </Link>
            </li>
            <li>
              <Link
                href="/reviews"
                className="font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%] hover:text-[#C3974C] transition-colors"
              >
                Отзывы
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%] hover:text-[#C3974C] transition-colors"
              >
                Контакты
              </Link>
            </li>
          </ul>
        </div>

        {/* Социальные сети section */}
        <div>
          <h4 className="mb-[26px] font-normal text-lg leading-[120%] tracking-[-5%] align-middle">Социальные сети</h4>
          <ul className="space-y-[16px] text-[#27272799] text-sm max-md:space-y-2">
            <li>
              <a
                href="https://vk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%] hover:text-[#C3974C] transition-colors"
              >
                ВКонтакте
              </a>
            </li>
            <li>
              <a
                href="https://wa.me"
                target="_blank"
                rel="noopener noreferrer"
                className="font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%] hover:text-[#C3974C] transition-colors"
              >
                WhatsApp*
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-normal text-sm leading-[130%] max-md:leading-[120%] tracking-[-1%] hover:text-[#C3974C] transition-colors"
              >
                Instagram*
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1340px] mx-auto px-4 pb-[64px] flex justify-between text-sm text-[#27272799] max-md:flex-col max-md:items-center max-md:gap-4">
        <p className='font-normal text-sm leading-[125%] tracking-[-3%]'>
          © 2025 Гениус Электро. Все права защищены.
        </p>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1 hover:text-[#C3974C] transition-colors cursor-pointer"
        >
          <FaArrowUp />
          Назад к началу
        </button>
      </div>
    </footer>
  )
}