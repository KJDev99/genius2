import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set, get) => ({
            cartItems: [],

            // Mahsulotni korzinkaga qo'shish
            addToCart: (product, quantity = 1) => {
                const { cartItems } = get();
                const existingItem = cartItems.find(item => item.id === product.id);

                if (existingItem) {
                    set({
                        cartItems: cartItems.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                    });
                } else {
                    set({
                        cartItems: [
                            ...cartItems,
                            {
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                article: product.article,
                                image: product.image,
                                size: product.size,
                                quantity: quantity,
                            },
                        ],
                    });
                }
            },

            // Mahsulot sonini yangilash
            updateQuantity: (productId, quantity) => {
                const { cartItems } = get();
                if (quantity <= 0) {
                    set({
                        cartItems: cartItems.filter(item => item.id !== productId),
                    });
                } else {
                    set({
                        cartItems: cartItems.map(item =>
                            item.id === productId ? { ...item, quantity } : item
                        ),
                    });
                }
            },

            // Mahsulotni o'chirish
            removeFromCart: (productId) => {
                const { cartItems } = get();
                set({
                    cartItems: cartItems.filter(item => item.id !== productId),
                });
            },

            // Korzinkani tozalash
            clearCart: () => {
                set({ cartItems: [] });
            },

            // Jami narx
            getTotalPrice: () => {
                const { cartItems } = get();
                return cartItems.reduce(
                    (total, item) => total + parseFloat(item.price) * item.quantity,
                    0
                );
            },

            // Jami mahsulotlar soni
            getTotalItems: () => {
                const { cartItems } = get();
                return cartItems.reduce((total, item) => total + item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);