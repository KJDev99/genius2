'use client';

import React, { useState, useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import GlassButton1 from '@/components/ui/GlassButton1';
import Button from '@/components/ui/Buttom';
import LogOut from './LogOut';

export default function LeftPanel({ setStep }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeBtn, setActiveBtn] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Личные данные', href: '/profile/dashboard' },
    { label: 'Корзина', href: '/profile/shop' },
    { label: 'Избранное', href: '/profile/favorites' },
    { label: 'Мои заказы', href: '/profile/zakas' },
    { label: 'Настройки', href: '/profile/nastroyca' },
  ];

  // Ekran o'lchamini kuzatish
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Joriy active tugmani aniqlash
  useEffect(() => {
    const currentIndex = menuItems.findIndex(item => item.href === pathname);
    if (currentIndex !== -1) {
      setActiveBtn(currentIndex);
    }
  }, [pathname]);

  // Breadcrumb uchun joriy sahifa nomini topish
  const getCurrentPageLabel = () => {
    const matchedItem = menuItems.find(item => item.href === pathname);
    return matchedItem ? matchedItem.label : 'Личные данные';
  };

  const currentLabel = getCurrentPageLabel();

  // Faol itemni topish
  const activeItem = menuItems[activeBtn];

  // Panel animatsiyasi
  const panelVariants = {
    open: {
      height: 'auto',
      opacity: 1,
      transition: { type: 'spring', stiffness: 250, damping: 30, mass: 0.7, when: 'beforeChildren', staggerChildren: 0.05 },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: { type: 'spring', stiffness: 300, damping: 35, when: 'afterChildren' },
    },
  };

  const buttonVariants = {
    open: { y: 0, opacity: 1 },
    closed: { y: -10, opacity: 0 },
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleItemClick = () => {
    if (isMobile) {
      // setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <div className="mt-8 mb-7 text-[#27272799] text-[16px]">
        <Link href="/" className="hover:text-[#272727] transition-colors">
          Главная
        </Link>{' '}
        / <span className="text-[#272727]">{currentLabel}</span>
      </div>

      <div className="p-[32px] shadow-[0_0_4px_0_#76767626] rounded-[12px] w-[330px] max-md:w-full relative">
        {/* Mobile - faqat tanlangan item ko'rinadi */}
        {isMobile && !isMobileMenuOpen && activeItem && (
          <div className="space-y-4">
            <Link href={activeItem.href}>
              <GlassButton1
                className="w-full"
                h="h-[62px]"
                text={activeItem.label}
                textsize="text-[26px]"
                active={true}
              />
            </Link>
          </div>
        )}

        {/* Desktop yoki mobil menyu ochiq bo'lganda */}
        {(isMobileMenuOpen || !isMobile) && (
          <>
            <div
              className="flex items-center justify-between cursor-pointer select-none max-md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              <h2 className="font-normal text-[16px] leading-[100%] tracking-[-1%]">
                Мой профиль
              </h2>
              <motion.div
                animate={{ rotate: isOpen ? 0 : 180 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <IoIosArrowDown size={20} />
              </motion.div>
            </div>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  variants={panelVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="flex flex-col gap-[22px] mt-[16px] overflow-hidden max-md:mt-2"
                >
                  {menuItems.map((item, idx) => (
                    <motion.div key={item.href} variants={buttonVariants}>
                      <Link href={item.href} onClick={handleItemClick}>
                        <GlassButton1
                          className="w-full max-md:w-full"

                          text={item.label}
                          textsize="text-[26px] max-md:text-[20px]"
                          active={activeBtn === idx}
                        />
                      </Link>
                    </motion.div>
                  ))}

                  {/* Chiqish tugmasi */}
                  <motion.div variants={buttonVariants}>
                    <Button
                      text={'Выйти'}
                      onClick={handleLogoutClick}
                      className="w-full h-[62px] flex justify-start px-6 border-[0.5px] border-[#D92727] font-normal text-[16px] leading-[100%] tracking-[-0.02em] text-[#D9272799] hover:text-[#D92727] hover:bg-red-50 transition-all cursor-pointer max-md:text-[14px]"
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Mobile menyu ochish/yopish tugmasi */}
        <div className='flex flex-col md:hidden mt-4'>
          <motion.div
            className={`flex items-center justify-center gap-2 cursor-pointer ${isMobileMenuOpen ? 'z-[55]' : ''}`}
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.95 }}
          >
            <p className='text-sm text-[#1E1E1E]'>
              {isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            </p>

            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <IoIosArrowDown className='text-[#1E1E1E] text-xl' />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {showLogoutModal && (
        <LogOut redirtUrl="/" setExitModalOpen={setShowLogoutModal} />
      )}
    </>
  );
}