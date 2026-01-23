"use client";
import React from 'react';
import CableCategories from './CableCategories';
import Product from '@/components/ui/Product';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Buttom';
import Link from 'next/link';
import { useCatalogStore } from '@/store/catalogStore';

export default function RightPanel() {
  const {
    filteredProducts,
    loading,
    fetchProducts,
    setSortBy,
    setPerPage,
    perPage,
    sortBy,
    filters,
    setFilters,
    selectedSubCategory,
    categories,
    mainCategoryId,
  } = useCatalogStore();

  const [popularOpen, setPopularOpen] = React.useState(false);
  const [perPageOpen, setPerPageOpen] = React.useState(false);

  const currentCategory = categories.find(cat => cat.id === mainCategoryId);
  const subCategories = currentCategory?.sub_categories || [];

  const handleSearch = (e) => {
    const value = e.target.value;
    const newFilters = {
      ...filters,
      search: value,
      main_category_id: mainCategoryId,
    };

    if (selectedSubCategory) {
      newFilters.sub_category_id = selectedSubCategory;
    }

    setFilters(newFilters);
    fetchProducts(newFilters);
  };

  const handleSortSelect = (sortType) => {
    setSortBy(sortType);
    setPopularOpen(false);

    const newFilters = {
      ...filters,
      main_category_id: mainCategoryId,
    };

    if (selectedSubCategory) {
      newFilters.sub_category_id = selectedSubCategory;
    }

    fetchProducts(newFilters);
  };

  const handlePerPageSelect = (count) => {
    setPerPage(count);
    setPerPageOpen(false);

    const newFilters = {
      ...filters,
      limit: count,
      main_category_id: mainCategoryId,
    };

    if (selectedSubCategory) {
      newFilters.sub_category_id = selectedSubCategory;
    }

    setFilters(newFilters);
    fetchProducts(newFilters);
  };

  const sortOptions = [
    { label: 'Популярное', value: 'popular' },
    { label: 'Новинки', value: 'new' },
    { label: 'Сначала дешевые', value: 'cheap' },
    { label: 'Сначала дорогие', value: 'expensive' },
  ];

  const perPageOptions = [12, 24, 48];

  return (
    <div className=''>
      {/* Subkategoriyalar - LOADER YO'Q */}
      {subCategories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Выберите подкатегорию:</h3>
          <CableCategories />
        </div>
      )}

      {/* Filtr va sortirovka - LOADER YO'Q */}
      <div className="flex gap-[48px] mt-[32px]">
        <div className='flex gap-[16px]'>
          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setPopularOpen(!popularOpen)}
              className="flex items-center justify-between w-[249px] h-[61px] px-5 py-3 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition"
            >
              {sortOptions.find(opt => opt.value === sortBy)?.label || 'Популярное'}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {popularOpen && (
              <div className="absolute z-100 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200">
                <ul className="py-2">
                  {sortOptions.map((option) => (
                    <li
                      key={option.value}
                      className="px-5 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSortSelect(option.value)}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Items per page dropdown */}
          <div className="relative">
            <button
              onClick={() => setPerPageOpen(!perPageOpen)}
              className="flex items-center justify-between w-[265px] h-[61px] px-5 py-3 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition"
            >
              Показать по {perPage}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {perPageOpen && (
              <div className="absolute z-20 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200">
                <ul className="py-2">
                  {perPageOptions.map((count) => (
                    <li
                      key={count}
                      className="px-5 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handlePerPageSelect(count)}
                    >
                      Показать по {count}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Search input - LOADER YO'Q */}
        <div className="relative">
          <input
            type="text"
            placeholder="Найдите все, что вам нужно"
            className="w-[421px] h-[61px] pl-[18px] pr-12 text-[18px] placeholder:text-[#B89B72] bg-gradient-to-br from-[#FDF9F2] to-[#F5EDE2] rounded-[12px] focus:outline-none"
            style={{
              border: "1px solid transparent",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              backgroundImage: "linear-gradient(#FDF9F2, #F5EDE2), linear-gradient(119.47deg, #D8C19A 20.35%, #C3974C 94.16%)",
            }}
            value={filters.search || ''}
            onChange={handleSearch}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-br from-[#D8C19A] to-[#C3974C] rounded-lg w-10.75 h-10.75 flex items-center justify-center">
            <MagnifyingGlassIcon className="w-3.75 h-3.75 text-white" />
          </div>
        </div>
      </div>

      {/* FAQAT PRODUCTLAR UCHUN LOADER */}
      <div className="mt-[48px] min-h-[400px] relative">
        {loading ? (
          // Loader - faqat products joyi uchun
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {/* Animated spinner */}
                <div className="w-16 h-16 border-4 border-gray-200 border-t-[#C3974C] rounded-full animate-spin"></div>

                {/* Inner spinner */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-4 border-transparent border-t-[#D8C19A] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
              </div>

              <p className="text-gray-600 font-medium">Загрузка товаров...</p>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          // Products mavjud
          <>
            <div className='grid grid-cols-3 gap-[24px]'>
              {filteredProducts.map((product) => (
                <div key={product.id}>
                  <Product
                    id={product.id}
                    isNew={new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
                    isLike={product.is_favourite}
                    img={product.images?.[0]?.image || '/sec.png'}
                    title={product.name}
                    item={product.description}
                    price={parseFloat(product.price_per_meter)}
                    manufacturer={product.manufacturer}
                    stock={product.stock}
                    size={product.meterages?.map(m => m.value) || []}
                  />
                </div>
              ))}
            </div>

            {/* Load More button */}
            <div className="flex justify-center">
              <Button
                className={`bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] rounded-[12px] w-[261px] h-[66px] mt-[32px]`}
                text={'Смотреть больше'}
                onClick={() => {
                  const nextPage = (filters.page || 1) + 1;
                  const newFilters = {
                    ...filters,
                    page: nextPage,
                    main_category_id: mainCategoryId,
                  };

                  if (selectedSubCategory) {
                    newFilters.sub_category_id = selectedSubCategory;
                  }

                  setFilters(newFilters);
                  fetchProducts(newFilters);
                }}
              />
            </div>
          </>
        ) : (
          // Productlar yo'q
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Товары не найдены</h3>
            <p className="text-gray-500">
              {selectedSubCategory
                ? `В подкатегории "${subCategories.find(sc => sc.id === selectedSubCategory)?.name}" товаров пока нет`
                : 'Попробуйте изменить параметры фильтра или выбрать другую категорию'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 