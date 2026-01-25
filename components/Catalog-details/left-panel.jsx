"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Buttom';
import { useCatalogStore } from '@/store/catalogStore';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

// Accordion Filter Component - MEMOIZED
const AccordionFilter = React.memo(({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className=" w-full rounded-md border border-gray-300 py-4 px-4 bg-white max-md:w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-base font-medium text-[#272727] hover:text-gray-700 transition-colors"
      >
        <span>{title}</span>
        <motion.span
          variants={{
            open: { rotate: 0 },
            closed: { rotate: -90 },
          }}
          initial={false}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <AiOutlineMinus size={20} /> : <AiOutlinePlus size={20} />}
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

AccordionFilter.displayName = 'AccordionFilter';

// Checkbox Group Component - MEMOIZED
const CheckboxGroup = React.memo(({ options, selected = [], onChange }) => {
  const handleChange = useCallback((value) => {
    const newSelected = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
    onChange(newSelected);
  }, [selected, onChange]);

  return (
    <div className="space-y-2 max-h-[200px] overflow-y-auto">
      {options.map((option) => (
        <label key={option} className="flex items-center space-x-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => handleChange(option)}
            className="w-4 h-4 rounded border-gray-300 text-[#C3974C] focus:ring-[#C3974C]"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900">{option}</span>
        </label>
      ))}
    </div>
  );
});

CheckboxGroup.displayName = 'CheckboxGroup';

// Price Range Filter Component - MEMOIZED (Bitta range bilan)
const PriceRangeFilter = React.memo(({ min, max, currentMin, currentMax, onChange }) => {
  const rangeMin = useRef(min);
  const rangeMax = useRef(max);
  const timeoutRef = useRef(null);

  // Range track style
  const getTrackStyle = () => {
    const minPercent = ((currentMin - rangeMin.current) / (rangeMax.current - rangeMin.current)) * 100;
    const maxPercent = ((currentMax - rangeMin.current) / (rangeMax.current - rangeMin.current)) * 100;

    return {
      background: `linear-gradient(to right, 
        #e5e7eb 0%, 
        #e5e7eb ${minPercent}%, 
        #C3974C ${minPercent}%, 
        #C3974C ${maxPercent}%, 
        #e5e7eb ${maxPercent}%, 
        #e5e7eb 100%)`
    };
  };

  const handleRangeChange = useCallback((e) => {
    const value = parseInt(e.target.value);
    const isMinThumb = e.target.dataset.type === 'min';

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isMinThumb) {
      // Minimum thumb harakati
      const newMin = Math.min(value, currentMax - 10);
      onChange({ min: newMin, max: currentMax });
    } else {
      // Maximum thumb harakati
      const newMax = Math.max(value, currentMin + 10);
      onChange({ min: currentMin, max: newMax });
    }

    // Debounce
    timeoutRef.current = setTimeout(() => { }, 500);
  }, [currentMin, currentMax, onChange]);

  const handleInputChange = useCallback((type, value) => {
    const numValue = parseInt(value) || 0;

    if (type === 'min') {
      const newMin = Math.min(Math.max(numValue, rangeMin.current), currentMax - 10);
      onChange({ min: newMin, max: currentMax });
    } else {
      const newMax = Math.max(Math.min(numValue, rangeMax.current), currentMin + 10);
      onChange({ min: currentMin, max: newMax });
    }
  }, [currentMin, currentMax, onChange]);

  useEffect(() => {
    rangeMin.current = min;
    rangeMax.current = max;
  }, [min, max]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Range Track Container */}
      <div className="relative h-2">
        {/* Track background */}
        <div
          className="absolute top-0 left-0 right-0 h-2 rounded-full"
          style={getTrackStyle()}
        />

        {/* Minimum thumb */}
        <input
          type="range"
          data-type="min"
          min={rangeMin.current}
          max={rangeMax.current}
          value={currentMin}
          onChange={handleRangeChange}
          className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer z-20"
        />

        {/* Maximum thumb */}
        <input
          type="range"
          data-type="max"
          min={rangeMin.current}
          max={rangeMax.current}
          value={currentMax}
          onChange={handleRangeChange}
          className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer z-10"
        />

        {/* Thumb indicators */}
        <div
          className="absolute top-1/2 h-6 w-6 bg-[#C3974C] rounded-full border-4 border-white shadow-lg transform -translate-y-1/2 z-30"
          style={{ left: `${((currentMin - rangeMin.current) / (rangeMax.current - rangeMin.current)) * 100}%` }}
        />
        <div
          className="absolute top-1/2 h-6 w-6 bg-[#C3974C] rounded-full border-4 border-white shadow-lg transform -translate-y-1/2 z-30"
          style={{ left: `${((currentMax - rangeMin.current) / (rangeMax.current - rangeMin.current)) * 100}%` }}
        />
      </div>

      {/* Price Display */}
      <div className="p-3 bg-gradient-to-br from-[#FDF9F2] to-[#F5EDE2] rounded-lg">
        <p className="text-center text-sm font-medium text-gray-700">
          {currentMin.toLocaleString('ru-RU')} ₽ - {currentMax.toLocaleString('ru-RU')} ₽
        </p>
      </div>
    </div>
  );
});

PriceRangeFilter.displayName = 'PriceRangeFilter';

// YANGI: LeftPanel componentni memoize qilish
const LeftPanelContent = React.memo(() => {
  const {
    filters,
    setFilters,
    resetFilters,
    filterData,
    fetchFilterData,
    fetchProducts,
    mainCategoryId,
  } = useCatalogStore();

  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const hasLoadedFilterData = useRef(false);
  const lastCategoryId = useRef(null);

  // Faqat kategoriya o'zgarganda filter data yuklash
  useEffect(() => {
    if (mainCategoryId && mainCategoryId !== lastCategoryId.current) {
      fetchFilterData(mainCategoryId);
      lastCategoryId.current = mainCategoryId;
      hasLoadedFilterData.current = true;
    }
  }, [mainCategoryId, fetchFilterData]);

  // Boshlang'ich narx oralig'ini o'rnatish
  useEffect(() => {
    if (filterData?.price_range) {
      const min = Math.floor(filterData.price_range.min);
      const max = Math.ceil(filterData.price_range.max);
      setPriceRange({ min, max });

      if (!filters.min_price && !filters.max_price) {
        setFilters({
          min_price: min,
          max_price: max
        });
      }
    }
  }, [filterData?.price_range, filters, setFilters]);

  // Filter o'zgarganda mahsulotlarni yuklash
  const handleFilterChange = useCallback((filterName, values) => {
    const newFilters = {
      ...filters,
      [filterName]: values.length > 0 ? values.join(',') : undefined,
      page: 1
    };
    setFilters(newFilters);
    fetchProducts(newFilters);
  }, [filters, setFilters, fetchProducts]);

  const handlePriceChange = useCallback((value) => {
    setPriceRange(value);
    const newFilters = {
      ...filters,
      min_price: value.min,
      max_price: value.max,
      page: 1
    };
    setFilters(newFilters);
    fetchProducts(newFilters);
  }, [filters, setFilters, fetchProducts]);

  const handleReset = useCallback(() => {
    resetFilters();
    if (filterData?.price_range) {
      setPriceRange({
        min: Math.floor(filterData.price_range.min),
        max: Math.ceil(filterData.price_range.max)
      });
    }
  }, [resetFilters, filterData?.price_range]);

  const handleToggleFilter = useCallback((filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value,
      page: 1
    };
    setFilters(newFilters);
    fetchProducts(newFilters);
  }, [filters, setFilters, fetchProducts]);

  const parseFilterValues = useCallback((filterKey) => {
    const value = filters[filterKey];
    if (!value) return [];
    return typeof value === 'string' ? value.split(',') : [];
  }, [filters]);

  // Loading state
  if (!filterData) {
    return (
      <div className=" w-full max-md:w-full">
        <div className="animate-pulse space-y-4">
          <div className="h-[56px] bg-gray-200 rounded-lg"></div>
          <div className="h-[100px] bg-gray-200 rounded-lg"></div>
          <div className="h-[100px] bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className='items-center flex justify-between px-[18px] w-full max-md:w-full h-[56px] rounded-[10px] border border-[#27272733] max-md:w-full'>
        <h2 className="font-inter text-[20px] font-normal leading-[20px] tracking-[-0.02em]">
          Фильтры
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="hidden md:block font-inter text-[16px] font-normal leading-[18px] tracking-[0em] text-[#27272799] hover:text-gray-900 transition-colors"
          >
            Сбросить
          </button>
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="md:hidden"
          >
            {isFiltersOpen ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
          </button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence initial={false}>
        {isFiltersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className='mt-[12px] gap-[12px] grid grid-cols-1'>
              {/* Manufacturer Filter */}
              {filterData.manufacturers?.length > 0 && (
                <AccordionFilter title="Производитель" defaultOpen={true}>
                  <CheckboxGroup
                    options={filterData.manufacturers}
                    selected={parseFilterValues('manufacturer')}
                    onChange={(values) => handleFilterChange('manufacturer', values)}
                  />
                </AccordionFilter>
              )}

              {/* Cable Cross Section */}
              {filterData.cable_cross_sections?.length > 0 && (
                <AccordionFilter title="Сечение кабеля, мм²">
                  <CheckboxGroup
                    options={filterData.cable_cross_sections.map(s => s.toString())}
                    selected={parseFilterValues('cable_cross_section')}
                    onChange={(values) => handleFilterChange('cable_cross_section', values)}
                  />
                </AccordionFilter>
              )}

              {/* Number of Cores */}
              {filterData.number_of_cores?.length > 0 && (
                <AccordionFilter title="Количество жил">
                  <CheckboxGroup
                    options={filterData.number_of_cores.map(n => n.toString())}
                    selected={parseFilterValues('number_of_cores')}
                    onChange={(values) => handleFilterChange('number_of_cores', values)}
                  />
                </AccordionFilter>
              )}

              {/* Conductor Material */}
              {filterData.conductor_materials?.length > 0 && (
                <AccordionFilter title="Материал проводника">
                  <CheckboxGroup
                    options={filterData.conductor_materials}
                    selected={parseFilterValues('conductor_material')}
                    onChange={(values) => handleFilterChange('conductor_material', values)}
                  />
                </AccordionFilter>
              )}

              {/* Color */}
              {filterData.colors?.length > 0 && (
                <AccordionFilter title="Цвет">
                  <CheckboxGroup
                    options={filterData.colors}
                    selected={parseFilterValues('color')}
                    onChange={(values) => handleFilterChange('color', values)}
                  />
                </AccordionFilter>
              )}

              {/* Conductor Insulation Material */}
              {filterData.conductor_insulation_materials?.length > 0 && (
                <AccordionFilter title="Материал изоляции проводника">
                  <CheckboxGroup
                    options={filterData.conductor_insulation_materials}
                    selected={parseFilterValues('conductor_insulation_material')}
                    onChange={(values) => handleFilterChange('conductor_insulation_material', values)}
                  />
                </AccordionFilter>
              )}

              {/* Outer Insulation Material */}
              {filterData.outer_insulation_materials?.length > 0 && (
                <AccordionFilter title="Материал внешней изоляции">
                  <CheckboxGroup
                    options={filterData.outer_insulation_materials}
                    selected={parseFilterValues('outer_insulation_material')}
                    onChange={(values) => handleFilterChange('outer_insulation_material', values)}
                  />
                </AccordionFilter>
              )}

              {/* Outer Sheath Material */}
              {filterData.outer_sheath_materials?.length > 0 && (
                <AccordionFilter title="Материал внешней оболочки">
                  <CheckboxGroup
                    options={filterData.outer_sheath_materials}
                    selected={parseFilterValues('outer_sheath_material')}
                    onChange={(values) => handleFilterChange('outer_sheath_material', values)}
                  />
                </AccordionFilter>
              )}

              {/* Model Version */}
              {filterData.model_versions?.length > 0 && (
                <AccordionFilter title="Модель/Исполнение">
                  <CheckboxGroup
                    options={filterData.model_versions}
                    selected={parseFilterValues('model_version')}
                    onChange={(values) => handleFilterChange('model_version', values)}
                  />
                </AccordionFilter>
              )}

              {/* New Products Toggle */}
              <AccordionFilter title="Новые товары">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.new || false}
                    onChange={(e) => handleToggleFilter('new', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#C3974C] focus:ring-[#C3974C]"
                  />
                  <span className="text-sm text-gray-700">Показать только новые</span>
                </label>
              </AccordionFilter>

              {/* Popular Products Toggle */}
              <AccordionFilter title="Популярные">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.popular || false}
                    onChange={(e) => handleToggleFilter('popular', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#C3974C] focus:ring-[#C3974C]"
                  />
                  <span className="text-sm text-gray-700">Показать популярные</span>
                </label>
              </AccordionFilter>
            </div>

            {/* Price Range Filter */}
            {filterData.price_range && (
              <div className="mt-[12px]">
                <AccordionFilter title="Цена (₽)" defaultOpen={true}>
                  <PriceRangeFilter
                    min={Math.floor(filterData.price_range.min)}
                    max={Math.ceil(filterData.price_range.max)}
                    currentMin={filters.min_price || Math.floor(filterData.price_range.min)}
                    currentMax={filters.max_price || Math.ceil(filterData.price_range.max)}
                    onChange={handlePriceChange}
                  />
                </AccordionFilter>
              </div>
            )}

            {/* Register Banner */}
            <div className=" w-full mt-[12px] max-md:hidden">
              <div className="bg-white p-[24px] rounded-2xl shadow">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1468&q=80"
                    alt="Электрик провода режет"
                    className="w-[269px] h-[79px] object-cover rounded-2xl"
                  />
                </div>
                <div className="">
                  <h3 className="text-xl font-semibold text-[#272727] mb-2 mt-[16px]">
                    Про оформление заказа:
                  </h3>
                  <p className="font-normal text-sm leading-4 tracking-[-0.02em]">
                    Перед добавлением товара в корзину, вам нужно зарегистрироваться на нашем сайте, чтобы оформить заказ
                  </p>
                </div>
              </div>
              <Button
                className={' w-full h-[50px] bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] mt-4'}
                text={'Зарегистрироваться'}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

LeftPanelContent.displayName = 'LeftPanelContent';

// Asosiy component - unmount bo'lmasligi uchun
export default function LeftPanel() {
  return <LeftPanelContent />;
}