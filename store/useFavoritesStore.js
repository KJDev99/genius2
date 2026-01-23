import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
    persist(
        (set, get) => ({
            favoriteIds: [],

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

            // Sevimlilarga qo'shish
            addFavorite: (productId) => {
                const { favoriteIds } = get();
                if (!favoriteIds.includes(productId)) {
                    set({ favoriteIds: [...favoriteIds, productId] });
                }
            },

            // Sevimlilardan o'chirish
            removeFavorite: (productId) => {
                const { favoriteIds } = get();
                set({ favoriteIds: favoriteIds.filter(id => id !== productId) });
            },

            // Toggle favorite
            toggleFavorite: (productId) => {
                const { favoriteIds } = get();
                if (favoriteIds.includes(productId)) {
                    set({ favoriteIds: favoriteIds.filter(id => id !== productId) });
                } else {
                    set({ favoriteIds: [...favoriteIds, productId] });
                }
            },

            // Barcha sevimlilarni tozalash
            clearFavorites: () => {
                set({ favoriteIds: [] });
            },
        }),
        {
            name: 'favorites-storage',
        }
    )
);