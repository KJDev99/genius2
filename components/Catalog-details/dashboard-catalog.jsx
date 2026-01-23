"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCatalogStore } from '@/store/catalogStore';
import Link from 'next/link';
import LeftPanel from './left-panel';
import RightPanel from './right-panel';

export default function DashboardCatalog() {
  const params = useParams();
  const categoryId = params.id;

  const {
    fetchMainCategories,
    fetchProducts,
    fetchFilterData,
    setMainCategoryId,
    mainCategoryName,
    loading,
    filters
  } = useCatalogStore();

  // Kategoriyalarni faqat bir marta yuklash
  useEffect(() => {
    fetchMainCategories();
  }, []);

  // Kategoriya o'zgarganda yoki birinchi marta kirganda products yuklash
  useEffect(() => {
    if (categoryId) {
      const parsedId = parseInt(categoryId);

      // Main category ID ni o'rnatish
      setMainCategoryId(parsedId);

      // Filter data yuklash
      fetchFilterData(parsedId);

      // Mahsulotlarni yuklash - ASOSIY QISMI!
      // Birinchi marta kirganda default filterlar bilan yuklash
      fetchProducts({
        main_category_id: parsedId,
        page: 1,
        limit: 12
      });
    }
  }, [categoryId, setMainCategoryId, fetchFilterData, fetchProducts]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 max-w-[1340px] mx-auto">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link href="/" className="hover:text-gray-900">Главная</Link>
                <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
                </svg>
              </li>
              <li className="flex items-center">
                <span className="text-gray-900 font-medium">{mainCategoryName || 'Каталог'}</span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {mainCategoryName || 'Каталог товаров'}
        </h1>

        <div className="flex gap-8">
          {/* Left Panel - Filters */}
          <div className="w-1/4">
            <LeftPanel />
          </div>

          {/* Right Panel - Products */}
          <div className="w-3/4">
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  );
}