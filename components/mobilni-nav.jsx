"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useApiStore } from "@/store/useApiStore";

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getData } = useApiStore();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);

    // Auth holatini tinglash uchun event listener
    const handleAuthChange = () => {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("authChanged", handleAuthChange);
    return () => window.removeEventListener("authChanged", handleAuthChange);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const result = await getData('products/main-categories/');

        if (result?.success && result?.data) {
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

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    // Navbar'ni yangilash uchun event yuborish
    window.dispatchEvent(new Event("authChanged"));
    window.location.href = "/";
    setIsOpen(false);
  };

  return (
    <>
      <div className="lg:hidden">
        <div className="flex justify-between items-center py-[24px] px-[14px] max-md:px-6 max-md:py-4">
          <Image src="/icon/logoblack.svg" width={70} height={50} alt="Genius Electro" />
          <button onClick={() => setIsOpen(!isOpen)} className="text-[#C3974C]">
            {isOpen ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsOpen(false)}>
          <div
            className="bg-white h-full w-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col min-h-screen py-6">
              {/* Header */}
              <div className="flex justify-between items-center px-6 mb-6">
                <Link href="/">
                  <Image src="/icon/logoblack.svg" width={80} height={55} alt="Logo" className="h-11" />
                </Link>
                <button onClick={() => setIsOpen(false)}>
                  <XMarkIcon className="w-8 h-8 text-gray-600" />
                </button>
              </div>

              {/* Search va Login Buttons */}
              <div className="px-4 flex flex-col items-center mb-8">
                <div className="flex items-center gap-3 mb-4">
                  {/* Favorites button */}
                  {isLoggedIn ? (
                    <Link href="/profile/favorites" onClick={() => setIsOpen(false)}>
                      <div className="w-[47px] h-[47px] bg-gradient-to-br from-[#D8C19A] to-[#C3974C] rounded-[12px] flex items-center justify-center cursor-pointer">
                        <Image src="/icon/navbaricon1.svg" width={18} height={18} alt="Favorites" />
                      </div>
                    </Link>
                  ) : (
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      <div className="w-[47px] h-[47px] bg-gradient-to-br from-[#D8C19A] to-[#C3974C] rounded-[12px] flex items-center justify-center cursor-pointer">
                        <Image src="/icon/navbaricon1.svg" width={18} height={18} alt="Favorites" />
                      </div>
                    </Link>
                  )}

                  {/* Cart button */}
                  {isLoggedIn ? (
                    <Link href="/profile/zakas" onClick={() => setIsOpen(false)}>
                      <div className="w-[47px] h-[47px] bg-gradient-to-br from-[#D8C19A] to-[#C3974C] rounded-[12px] flex items-center justify-center cursor-pointer">
                        <Image src="/icon/navbaricon2.svg" width={18} height={18} alt="Cart" />
                      </div>
                    </Link>
                  ) : (
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      <div className="w-[47px] h-[47px] bg-gradient-to-br from-[#D8C19A] to-[#C3974C] rounded-[12px] flex items-center justify-center cursor-pointer">
                        <Image src="/icon/navbaricon2.svg" width={18} height={18} alt="Cart" />
                      </div>
                    </Link>
                  )}

                  {/* Login/Profile button */}
                  {isLoggedIn ? (
                    <Link href="/profile/dashboard" onClick={() => setIsOpen(false)}>
                      <button className="w-[180px] text-[#272727] h-[47px] bg-gradient-to-br from-[#D8C19A] to-[#C3974C] rounded-[12px] font-normal text-[14px] hover:opacity-90 transition">
                        Мой профиль
                      </button>
                    </Link>
                  ) : (
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      <button className="w-[180px] text-[#272727] h-[47px] bg-gradient-to-br from-[#D8C19A] to-[#C3974C] rounded-[12px] font-normal text-[14px] hover:opacity-90 transition">
                        Вход в аккаунт
                      </button>
                    </Link>
                  )}
                </div>

                {/* Search input */}
                <div className="relative w-full max-w-[342px]">
                  <input
                    type="text"
                    placeholder="Найдите все, что вам нужно"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-[47px] pl-[18px] pr-12 text-base placeholder:text-[#B89B72] bg-gradient-to-br from-[#FDF9F2] to-[#F5EDE2] rounded-[12px] focus:outline-none"
                    style={{
                      border: "1px solid transparent",
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                      backgroundImage:
                        "linear-gradient(#FDF9F2, #F5EDE2), linear-gradient(119.47deg, #D8C19A 20.35%, #C3974C 94.16%)",
                    }}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-br from-[#D8C19A] to-[#C3974C] rounded-lg w-9 h-9 flex items-center justify-center">
                    <MagnifyingGlassIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Navigation Links */}

              {/* Kategoriyalar (Продукция) */}
              <div className="px-6 mb-8">
                <h2 className="font-normal text-[18px] leading-[120%] tracking-[-0.02em] mb-4">
                  Продукция
                </h2>

                {loading ? (
                  <div className="text-center py-4 text-gray-500">
                    Загрузка категорий...
                  </div>
                ) : categories.length > 0 ? (
                  <div className="grid grid-cols-2 gap-0">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/catalog-details/${category.id}`}
                        onClick={() => setIsOpen(false)}
                        className="block py-2 "
                      >
                        <div className="font-medium text-gray-800 line-clamp-1">{category.name}</div>

                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Нет доступных категорий
                  </div>
                )}
              </div>
              <div className="px-6 mb-8 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <h2 className="text-[#272727] mb-4 text-lg">Компания</h2>
                  <Link href="/about" onClick={() => setIsOpen(false)} className="text-lg font-medium py-2 text-[#27272799]">
                    О нас
                  </Link>
                  <Link href="/reviews" onClick={() => setIsOpen(false)} className="text-lg font-medium py-2 text-[#27272799]">
                    Отзывы
                  </Link>

                  <Link href="/contact" onClick={() => setIsOpen(false)} className="text-lg font-medium py-2 text-[#27272799]">
                    Контакты
                  </Link>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[#272727] mb-4 text-lg">Социальные сети</h2>
                  <a href="#" onClick={() => setIsOpen(false)} className="text-lg font-medium py-2 text-[#27272799]">
                    ВКонтакте
                  </a>
                  <a href="#" onClick={() => setIsOpen(false)} className="text-lg font-medium py-2 text-[#27272799]">
                    WhatsApp*
                  </a>

                  <a href="#" onClick={() => setIsOpen(false)} className="text-lg font-medium py-2 text-[#27272799]">
                    Instagram*
                  </a>
                </div>
              </div>


              {/* Contact Information */}
              <div className="px-6 mb-8 grid grid-cols-2">
                <div className="mb-6">
                  <h2 className="font-normal text-[18px] leading-[120%] tracking-[-0.02em] mb-2">
                    Телефон
                  </h2>
                  <p className="text-[#272727] font-normal text-[16px] leading-[160%]">
                    +7 945 434-43-43
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="font-normal text-[18px] leading-[120%] tracking-[-0.02em] mb-2">
                    Почта поддержки
                  </h2>
                  <p className="text-[#272727] font-normal text-[16px] leading-[160%]">
                    info@geniuselectro.ru
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 mt-auto pt-8 border-t border-gray-200">
                <p className="text-[#27272799] text-center font-normal text-[14px] leading-[125%] tracking-[-0.02em]">
                  © 2025 Гениус Электро. Все права защищены.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}