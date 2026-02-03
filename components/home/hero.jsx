'use client'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { useState, useEffect, useRef } from 'react';
import { useApiStore } from '@/store/useApiStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();
  const { getData } = useApiStore();

  // Click outside to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search function
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      const response = await getData(`/products/products/?search=${encodeURIComponent(searchQuery)}`);

      if (response?.success && response?.data?.results) {
        setSearchResults(response.data.results);
        setShowResults(true);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debounce
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      // Debounce search
      const timeoutId = setTimeout(async () => {
        try {
          setIsLoading(true);
          const response = await getData(`/products/products/?search=${encodeURIComponent(value)}`);

          if (response?.success && response?.data?.results) {
            setSearchResults(response.data.results);
            setShowResults(true);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  // Handle product click
  const handleProductClick = (productId) => {
    router.push(`/product/${productId}`);
    setShowResults(false);
    setSearchQuery('');
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="mt-[32px] px-4 lg:px-8 max-md:mt-0">
      <div
        className="relative max-w-[1340px] mx-auto h-[761px] rounded-[32px] 
                   bg-cover bg-center bg-[url('/headerimg.png')]
                   flex flex-col justify-center items-center
                   text-center
                   sm:h-[700px] md:h-[761px] max-sm:h-[700px] max-md:rounded-[24px]"
      >
        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-t from-[#40404080] to-[rgba(67,67,67,0.2)]"></div>
        <div className="relative z-10 px-4 max-w-full max-md:w-full">
          <p className="font-normal text-[18px] max-sm:text-[16px] leading-[120%] tracking-[-0.04em] text-white/60 mb-8">
            Работаем с 2015 года
          </p>
          <h1 className="font-normal text-[40px] max-sm:text-[28px] sm:text-[48px] md:text-[56px] lg:text-[60px] leading-[110%] tracking-[-0.04em] text-white mx-auto max-w-[682px]">
            Конструкторское бюро<br />
            кабельной продукции
          </h1>

          <div className="relative mt-12 mx-auto max-w-full" ref={searchRef}>
            <div className="relative">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Найдите все, что вам нужно"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onFocus={() => searchQuery.trim() && setShowResults(true)}
                  className="w-full max-w-[658px] h-[72px] p-3 pr-16 pl-6 text-[20px] placeholder:text-[#B89B72] 
                           rounded-[12px] focus:outline-none text-white max-md:text-sm max-md:h-[60px]"
                  style={{
                    background: '#EEDDC11A',
                    border: '1px solid #C3974C',
                  }}
                />

                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                           bg-gradient-to-br from-[#D8C19A] to-[#C3974C] 
                           rounded-[12px] w-[36px] h-[36px] sm:w-[56px] sm:h-[56px] 
                           flex items-center justify-center cursor-pointer shadow-md z-10 
                           max-md:rounded-[8px] hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <MagnifyingGlassIcon className="w-6 h-6 text-[#272727] max-md:w-4 max-md:h-4" />
                  )}
                </button>
              </form>
            </div>

            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full max-w-[658px] bg-gradient-to-b from-white to-gray-50 rounded-[8px] shadow-2xl z-50 max-h-[400px] overflow-y-auto border border-[#C3974C]/20">
                <div className="p-2">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D8C19A] to-[#C3974C] flex items-center justify-center">
                        <MagnifyingGlassIcon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-medium text-gray-700">
                        Найдено: <span className="text-[#C3974C] font-semibold">{searchResults.length}</span>
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowResults(false)}
                      className="w-8 h-8 shrink-0 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {searchResults.map((product) => {
                      // Asosiy rasmni topish
                      const mainImage = product.images?.find(img => img.is_main) || product.images?.[0];

                      return (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="group p-3 bg-white hover:bg-gradient-to-r hover:from-[#FDF9F2] hover:to-[#F5EDE2] rounded-[12px] cursor-pointer transition-all duration-200 border border-gray-100 hover:border-[#C3974C]/30 hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            {/* Product Image */}
                            <div className="w-16 h-16 flex-shrink-0 rounded-[10px] overflow-hidden border border-gray-200 group-hover:border-[#C3974C]/40">
                              {mainImage ? (
                                <img
                                  src={mainImage.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#D8C19A]/20 to-[#C3974C]/10 flex items-center justify-center">
                                  <svg className="w-6 h-6 text-[#C3974C]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex  justify-between gap-2">
                                <div className="flex flex-col items-start">
                                  <h4 className="font-medium text-gray-800 group-hover:text-[#272727] line-clamp-1 text-sm">
                                    {product.name}
                                  </h4>



                                  {/* Price */}
                                  <div className="flex items-center gap-2 mt-2">
                                    {product.price_per_meter && (
                                      <div className="flex items-center gap-1">
                                        <span className="text-[14px]  text-[#C3974C]">
                                          {product.price_per_meter} ₽/м
                                        </span>
                                      </div>
                                    )}


                                  </div>
                                </div>

                                {/* Arrow */}
                                <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-[#D8C19A] to-[#C3974C] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            {/* No Results */}
            {showResults && searchQuery.trim() && !isLoading && searchResults.length === 0 && (
              <div className="absolute top-full mt-2 w-full max-w-[658px] bg-white rounded-[12px] shadow-2xl z-50 p-4">
                <p className="text-gray-600 text-center py-4">
                  По запросу "{searchQuery}" ничего не найдено
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}