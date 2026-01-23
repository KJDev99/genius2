import { create } from 'zustand';
import { useApiStore } from './useApiStore';
import { useCartStore } from './useCartStore';

export const useOrderStore = create((set, get) => ({
    orderLoading: false,
    orderError: null,
    orderSuccess: false,

    // Zakaz yaratish
    createOrder: async (orderData) => {
        set({ orderLoading: true, orderError: null, orderSuccess: false });

        try {
            const { postDataToken } = useApiStore.getState();

            // Zakazni API ga yuborish
            const response = await postDataToken('/orders/create/', orderData);

            if (response && !response.detail) {
                // Zakazni qo'shib bo'lgach, savatni tozalash
                const { clearCart } = useCartStore.getState();
                clearCart();

                set({
                    orderSuccess: true,
                    orderLoading: false
                });

                return { success: true, data: response };
            } else {
                set({
                    orderError: response?.detail || 'Zakazni yaratishda xatolik',
                    orderLoading: false
                });
                return { success: false, error: response };
            }
        } catch (err) {
            const errorMsg = err?.message || 'Zakazni yaratishda xatolik yuz berdi';
            set({
                orderError: errorMsg,
                orderLoading: false
            });
            return { success: false, error: errorMsg };
        }
    },

    // Zakazni savatdan yaratish
    createOrderFromCart: async (deliveryData) => {
        const { cartItems } = useCartStore.getState();

        if (!cartItems || cartItems.length === 0) {
            set({ orderError: 'Savat bo\'sh' });
            return { success: false, error: 'Savat bo\'sh' };
        }

        // Product list ni formatlash
        const product_list = cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: parseFloat(item.price).toFixed(2)
        }));

        // Jami narxni hisoblash
        const total_price = cartItems.reduce(
            (total, item) => total + (parseFloat(item.price) * item.quantity),
            0
        ).toFixed(2);

        // Zakaz ob'ektini tuzish
        const orderData = {
            product_list,
            city: deliveryData.city || '',
            street: deliveryData.street || '',
            house: deliveryData.house || '',
            flat: deliveryData.flat || '',
            index: deliveryData.index || '',
            total_price,
            delivery_method: deliveryData.delivery_method || 0,
            payment_method: deliveryData.payment_method || 0,
            price_for_delivery: (deliveryData.price_for_delivery || 0).toString()
        };

        return get().createOrder(orderData);
    },

    // Xatoni tozalash
    clearError: () => {
        set({ orderError: null });
    },

    // Success holatini tozalash
    clearSuccess: () => {
        set({ orderSuccess: false });
    },
}));
