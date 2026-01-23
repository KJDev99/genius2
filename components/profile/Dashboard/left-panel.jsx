'use client';

import React, { useState, useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import GlassButton1 from '@/components/ui/GlassButton1';
import Button from '@/components/ui/Buttom';
import LogOut from './LogOut';

export default function LeftPanel({ setStep }) {  // step prop endi ishlatilmayapti, olib tashladim
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeBtn, setActiveBtn] = useState(0);

  const menuItems = [
    { label: 'Личные данные', href: '/profile/dashboard' },
    { label: 'Корзина', href: '/profile/shop' },
    { label: 'Избранное', href: '/profile/favorites' },
    { label: 'Мои заказы', href: '/profile/zakas' },
    { label: 'Настройки', href: '/profile/nastroyca' },
  ];

  // Joriy active tugmani aniqlash
  useEffect(() => {
    const currentIndex = menuItems.findIndex(item => item.href === pathname);
    if (currentIndex !== -1) {
      setActiveBtn(currentIndex);
    }
  }, [pathname, menuItems]);

  // Breadcrumb uchun joriy sahifa nomini topish
  const getCurrentPageLabel = () => {
    const matchedItem = menuItems.find(item => item.href === pathname);
    return matchedItem ? matchedItem.label : 'Личные данные'; // fallback
  };

  const currentLabel = getCurrentPageLabel();

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

  return (
    <>
      <div className="mt-8 mb-7 text-[#27272799] text-[16px]">
        <Link href="/" className="hover:text-[#272727] transition-colors">
          Главная
        </Link>{' '}
        / <span className="text-[#272727]">{currentLabel}</span>
      </div>

      <div className="p-[32px] shadow-[0_0_4px_0_#76767626] rounded-[12px] w-[330px]">
        <div
          className="flex items-center justify-between cursor-pointer select-none"
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
              className="flex flex-col gap-[22px] mt-[16px] overflow-hidden"
            >
              {menuItems.map((item, idx) => (
                <motion.div key={item.href} variants={buttonVariants}>
                  <Link href={item.href}>
                    <GlassButton1
                      w="w-[330px]"
                      h="h-[62px]"
                      text={item.label}
                      textsize="text-[26px]"
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
                  className="w-[254px] h-[62px] flex justify-start px-6 border-[0.5px] border-[#D92727] font-normal text-[16px] leading-[100%] tracking-[-0.02em] text-[#D9272799] hover:text-[#D92727] hover:bg-red-50 transition-all cursor-pointer"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Logout modal */}
      {showLogoutModal && (
        <LogOut redirtUrl="/" setExitModalOpen={setShowLogoutModal} />
      )}
    </>
  );
}