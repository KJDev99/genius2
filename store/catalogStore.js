import { create } from 'zustand';

export const useCatalogStore = create((set, get) => ({
    // State
    categories: [],
    mainCategoryId: null,
    mainCategoryName: '',
    selectedSubCategory: null,
    products: [],
    filteredProducts: [],
    filterData: null,
    filters: {
        main_category_id: null,
        sub_category_id: null,
        search: '',
        manufacturer: undefined,
        color: undefined,
        cable_cross_section: undefined,
        number_of_cores: undefined,
        conductor_material: undefined,
        conductor_insulation_material: undefined,
        outer_insulation_material: undefined,
        outer_sheath_material: undefined,
        model_version: undefined,
        min_price: undefined,
        max_price: undefined,
        new: false,
        popular: false,
        page: 1,
        limit: 12,
    },
    sortBy: 'popular',
    perPage: 12,
    loading: false,

    // Fetch filter data - faqat bir marta yuklash
    fetchFilterData: async (mainCategoryId) => {
        try {
            const currentFilterData = get().filterData;
            const currentCategoryId = get().mainCategoryId;

            // Agar bir xil kategoriya uchun allaqachon yuklangan bo'lsa, qayta yuklamaslik
            if (currentFilterData && currentCategoryId === mainCategoryId) {
                return;
            }

            const response = await fetch(
                `https://api.electro.motorsdream.ru/api/v1/products/products/filter-data/?main_category_id=${mainCategoryId}`
            );
            const data = await response.json();

            // Filter data ni saqlash
            set({
                filterData: data,
                mainCategoryId: mainCategoryId
            });

            // Agar narx oralig'i mavjud bo'lsa, filtrlarni o'rnatish
            if (data?.price_range) {
                const currentFilters = get().filters;
                if (!currentFilters.min_price && !currentFilters.max_price) {
                    set({
                        filters: {
                            ...currentFilters,
                            main_category_id: mainCategoryId,
                            min_price: Math.floor(data.price_range.min),
                            max_price: Math.ceil(data.price_range.max)
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching filter data:', error);
        }
    },

    // Fetch categories
    fetchMainCategories: async () => {
        try {
            const response = await fetch('https://api.electro.motorsdream.ru/api/v1/products/main-categories/');
            const data = await response.json();
            set({ categories: data });
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    },

    // Fetch products - faqat right panel uchun
    fetchProducts: async (filterParams = {}) => {
        set({ loading: true });

        const { filters, sortBy } = get();
        const params = new URLSearchParams();

        const allFilters = { ...filters, ...filterParams };

        // Barcha filtrlarni qo'shish
        Object.entries(allFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '' && value !== false) {
                if (typeof value === 'boolean') {
                    if (value === true) {
                        params.append(key, 'true');
                    }
                } else if (Array.isArray(value)) {
                    if (value.length > 0) {
                        params.append(key, value.join(','));
                    }
                } else {
                    params.append(key, value.toString());
                }
            }
        });

        // Sortlash
        if (sortBy === 'cheap') params.append('ordering', 'price_per_meter');
        if (sortBy === 'expensive') params.append('ordering', '-price_per_meter');
        if (sortBy === 'new') params.append('ordering', '-created_at');
        if (sortBy === 'popular') params.append('ordering', '-views');

        try {
            const response = await fetch(
                `https://api.electro.motorsdream.ru/api/v1/products/products/?${params.toString()}`
            );
            const data = await response.json();

            // Agar yangi sahifadan yuklanayotgan bo'lsa, eskilariga qo'shish
            const currentPage = allFilters.page || 1;
            const currentProducts = get().filteredProducts;

            if (currentPage > 1) {
                set({
                    filteredProducts: [...currentProducts, ...(data.results || data)],
                    loading: false
                });
            } else {
                set({
                    filteredProducts: data.results || data,
                    loading: false
                });
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            set({
                filteredProducts: [],
                loading: false
            });
        }
    },

    // Set filters - faqat state o'zgartiradi, API chaqirish emas
    setFilters: (newFilters) => {
        const { filters } = get();
        const updatedFilters = { ...filters, ...newFilters };
        set({ filters: updatedFilters });
    },

    // Reset filters
    resetFilters: () => {
        const { mainCategoryId, selectedSubCategory, filterData } = get();

        const resetFilters = {
            main_category_id: mainCategoryId,
            sub_category_id: selectedSubCategory,
            search: '',
            manufacturer: undefined,
            color: undefined,
            cable_cross_section: undefined,
            number_of_cores: undefined,
            conductor_material: undefined,
            conductor_insulation_material: undefined,
            outer_insulation_material: undefined,
            outer_sheath_material: undefined,
            model_version: undefined,
            min_price: filterData?.price_range ? Math.floor(filterData.price_range.min) : undefined,
            max_price: filterData?.price_range ? Math.ceil(filterData.price_range.max) : undefined,
            new: false,
            popular: false,
            page: 1,
            limit: 12,
        };

        set({
            filters: resetFilters,
            sortBy: 'popular',
            perPage: 12
        });

        // Mahsulotlarni yangilash
        get().fetchProducts(resetFilters);
    },

    // Set main category
    setMainCategoryId: (id) => {
        const category = get().categories.find(cat => cat.id === id);
        set({
            mainCategoryId: id,
            mainCategoryName: category?.name || '',
            selectedSubCategory: null,
            filteredProducts: [], // Oldingi mahsulotlarni tozalash
            filters: {
                ...get().filters,
                main_category_id: id,
                sub_category_id: null,
                page: 1
            }
        });
    },

    // Set subcategory
    setSelectedSubCategory: (id) => {
        set({
            selectedSubCategory: id,
            filteredProducts: [], // Oldingi mahsulotlarni tozalash
            filters: {
                ...get().filters,
                sub_category_id: id,
                page: 1
            }
        });
        // Mahsulotlarni yangi kategoriya bo'yicha yuklash
        setTimeout(() => {
            get().fetchProducts({
                ...get().filters,
                sub_category_id: id,
                page: 1
            });
        }, 0);
    },

    // Set sort
    setSortBy: (sort) => {
        set({
            sortBy: sort,
            filters: { ...get().filters, page: 1 }
        });
        get().fetchProducts({ ...get().filters, page: 1 });
    },

    // Set per page
    setPerPage: (count) => {
        set({
            perPage: count,
            filters: { ...get().filters, limit: count, page: 1 }
        });
        get().fetchProducts({ ...get().filters, limit: count, page: 1 });
    },
}));