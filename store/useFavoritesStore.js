import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
    persist(
        (set, get) => ({
            favoriteIds: [],
            favoriteProducts: [],
            loading: false,
            error: null,

            // Sevimlilar sonini olish
            getTotalFavorites: () => {
                const { favoriteIds } = get();
                return favoriteIds.length;
            },

            // Mahsulot sevimlilarda bormi?
            isFavorite: (productId) => {
                const { favoriteIds } = get();
                return favoriteIds.includes(productId);
            },

            // API orqali sevimlilarga qo'shish
            addFavorite: async (productId) => {
                const { favoriteIds, favoriteProducts } = get();

                set({ loading: true, error: null });

                try {
                    // 1. POST so'rovni bevosita yuborish
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/products/${productId}/favourite/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                        }
                    });

                    if (response.ok) {
                        // 2. Local state yangilash
                        const newIds = [...favoriteIds, productId];

                        // 3. Mahsulot ma'lumotlarini olish
                        const productResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/products/${productId}/`, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                            }
                        });

                        if (productResponse.ok) {
                            const productData = await productResponse.json();
                            const updatedProducts = [...favoriteProducts, productData];

                            set({
                                favoriteIds: newIds,
                                favoriteProducts: updatedProducts,
                                loading: false
                            });
                        } else {
                            set({
                                favoriteIds: newIds,
                                loading: false
                            });
                        }

                        return { success: true };
                    } else {
                        const errorData = await response.json();
                        set({
                            error: errorData,
                            loading: false
                        });
                        return { success: false, error: errorData };
                    }
                } catch (err) {
                    set({
                        error: err.message,
                        loading: false
                    });
                    return { success: false, error: err };
                }
            },

            // API orqali sevimlilardan o'chirish
            removeFavorite: async (productId) => {
                const { favoriteIds, favoriteProducts } = get();

                set({ loading: true, error: null });

                try {
                    // DELETE so'rovni bevosita yuborish
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/products/${productId}/favourite/remove/`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                        }
                    });

                    if (response.ok || response.status === 204) {
                        // Local state yangilash
                        const newIds = favoriteIds.filter(id => id !== productId);
                        const newProducts = favoriteProducts.filter(product => product.id !== productId);

                        set({
                            favoriteIds: newIds,
                            favoriteProducts: newProducts,
                            loading: false
                        });

                        return { success: true };
                    } else {
                        const errorData = await response.json();
                        set({
                            error: errorData,
                            loading: false
                        });
                        return { success: false, error: errorData };
                    }
                } catch (err) {
                    set({
                        error: err.message,
                        loading: false
                    });
                    return { success: false, error: err };
                }
            },

            // Toggle favorite (API bilan)
            toggleFavorite: async (productId) => {
                const { isFavorite } = get();

                if (isFavorite(productId)) {
                    return await get().removeFavorite(productId);
                } else {
                    return await get().addFavorite(productId);
                }
            },

            // API'dan barcha sevimlilarni olish
            fetchAllFavorites: async () => {
                set({ loading: true, error: null });

                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/products/favourites/`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                        }
                    });

                    if (response.ok) {
                        const result = await response.json();

                        if (result?.results) {
                            const ids = result.results.map(product => product.id);
                            set({
                                favoriteIds: ids,
                                favoriteProducts: result.results,
                                loading: false
                            });

                            return { success: true, data: result.results };
                        } else {
                            set({ loading: false });
                            return { success: false, error: 'No favorites found' };
                        }
                    } else {
                        const errorData = await response.json();
                        set({
                            error: errorData,
                            loading: false
                        });
                        return { success: false, error: errorData };
                    }
                } catch (err) {
                    set({
                        error: err.message,
                        loading: false
                    });
                    return { success: false, error: err };
                }
            },

            // Local sevimlilarga qo'shish (offline holat uchun)
            addLocalFavorite: (productId) => {
                const { favoriteIds } = get();
                if (!favoriteIds.includes(productId)) {
                    set({ favoriteIds: [...favoriteIds, productId] });
                }
            },

            // Local sevimlilardan o'chirish
            removeLocalFavorite: (productId) => {
                const { favoriteIds } = get();
                set({ favoriteIds: favoriteIds.filter(id => id !== productId) });
            },

            // Barcha sevimlilarni tozalash
            clearFavorites: () => {
                set({
                    favoriteIds: [],
                    favoriteProducts: [],
                    error: null
                });
            },

            // Loading holati
            setLoading: (loadingState) => set({ loading: loadingState }),

            // Xatolikni tozalash
            clearError: () => set({ error: null }),
        }),
        {
            name: 'favorites-storage',
            partialize: (state) => ({
                favoriteIds: state.favoriteIds,
                favoriteProducts: state.favoriteProducts,
            }),
        }
    )
);