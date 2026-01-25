"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, ChevronDownIcon, UserIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useApiStore } from "@/store/useApiStore";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const { getData } = useApiStore();

  useEffect(() => {
    // LocalStorage'dan access_token'ni tekshirish
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
    // Kategoriyalarni yuklash
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const result = await getData('products/main-categories/');

        if (result?.success && result?.data) {
          // Faqat birinchi 6 tasini olish
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
  };

  return (
    <div className="max-w-[1340px] mx-auto">
      <div className="mt-[43px] hidden lg:block">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Image src="/icon/logoblack.svg" width={83} height={59} alt="Genius Electro" />
          </div>
          <div className="flex items-center gap-[24px]">
            <Link href="/" className={`font-medium ${pathname === "/" ? "text-black" : "text-[#27272799]"}`}>
              Главная
            </Link>
            <Link href="/about" className={`${pathname === "/about" ? "text-black font-medium" : "text-[#27272799]"}`}>
              О нас
            </Link>

            {/* Katalog dropdown */}
            <div className="relative">
              <button
                onClick={() => setCatalogOpen(!catalogOpen)}
                className={`flex items-center gap-1 hover:text-black transition-colors duration-200 focus:outline-none ${pathname.startsWith("/catalog-details") ? "text-black font-medium" : "text-[#27272799]"
                  }`}
              >
                Каталог
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform duration-200 ${catalogOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {catalogOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    onMouseLeave={() => setCatalogOpen(false)}
                  >
                    <div className="py-4 px-2 max-h-80 overflow-y-auto">
                      {loading ? (
                        <div className="py-2 px-3 text-center text-gray-500">
                          Загрузка...
                        </div>
                      ) : categories.length > 0 ? (
                        categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/catalog-details/${category.id}`}
                            onClick={() => setCatalogOpen(false)}
                            className="block py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 mb-1"
                          >
                            <div className="font-medium text-gray-800">{category.name}</div>
                            {category.description && (
                              <div className="text-xs text-gray-500 truncate mt-1">
                                {category.description}
                              </div>
                            )}
                          </Link>
                        ))
                      ) : (
                        <div className="py-2 px-3 text-center text-gray-500">
                          Нет категорий
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href={'/reviews'} className={`${pathname === "/reviews" ? "text-black font-medium" : "text-[#27272799]"}`}>
              Отзывы
            </Link>
            <Link href={'/dastavca'} className={`${pathname === "/dastavca" ? "text-black font-medium" : "text-[#27272799]"}`}>
              Доставка и оплата
            </Link>
            <Link href={'/contact'} className={`${pathname === "/contact" ? "text-black font-medium" : "text-[#27272799]"}`}>
              Контакты
            </Link>
          </div>

          {/* O'ng qism - search va buttonlar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Найдите все, что вам нужно"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[328px] h-[47px] pl-[18px] pr-12 text-base placeholder:text-[#B89B72] bg-gradient-to-br from-[#FDF9F2] to-[#F5EDE2] rounded-[12px] focus:outline-none"
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

            {/* Favorites button */}
            {isLoggedIn ? (
              <Link href="/profile/favorites">
                <div className="w-[47px] h-[47px] bg-gradient-to-br from-[#D8C19A] to-[#C3974C] rounded-[12px] flex items-center justify-center cursor-pointer">
                  <Image src="/icon/navbaricon1.svg" width={18} height={18} alt="Favorites" />
                </div>
              </Link>
            ) : (
              <Link href="/auth/login">
                <div className="w-[47px] h-[47px] bg-gradient-to-br from-[#D8C19A] to-[#C3974C] rounded-[12px] flex items-center justify-center cursor-pointer">
                  <Image src="/icon/navbaricon1.svg" width={18} height={18} alt="Favorites" />
                </div>
              </Link>
            )}

            {/* Cart button */}
            {isLoggedIn ? (
              <Link href="/profile/zakas">
                <div className="w-[47px] h-[47px] bg-gradient-to-br from-[#D8C19A] to-[#C3974C] rounded-[12px] flex items-center justify-center cursor-pointer">
                  <Image src="/icon/navbaricon2.svg" width={18} height={18} alt="Cart" />
                </div>
              </Link>
            ) : (
              <Link href="/auth/login">
                <div className="w-[47px] h-[47px] bg-gradient-to-br from-[#D8C19A] to-[#C3974C] rounded-[12px] flex items-center justify-center cursor-pointer">
                  <Image src="/icon/navbaricon2.svg" width={18} height={18} alt="Cart" />
                </div>
              </Link>
            )}

            {/* Login/Profile button */}
            {isLoggedIn ? (
              <Link href="/profile/dashboard">
                <button className="w-[129px] text-[#272727] h-[47px] bg-gradient-to-br from-[#D8C19A] to-[#C3974C] rounded-[12px] font-normal text-[14px] hover:opacity-90 transition flex items-center justify-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Профиль
                </button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <button className="w-[129px] text-[#272727] h-[47px] bg-gradient-to-br from-[#D8C19A] to-[#C3974C] rounded-[12px] font-normal text-[14px] hover:opacity-90 transition">
                  Вход
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}