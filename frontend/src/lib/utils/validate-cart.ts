import apiClient from '../api-client';

/**
 * Validate and clean cart items
 * Removes items with invalid product IDs
 */
export const validateAndCleanCart = async (): Promise<void> => {
    try {
        const localCart = localStorage.getItem('cart');
        if (!localCart) {
            return;
        }

        const cartItems = JSON.parse(localCart);
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return;
        }

        console.log('🔍 Validating cart items...', cartItems);

        const validItems = [];
        const invalidItems = [];

        for (const item of cartItems) {
            try {
                // Check if product exists in database
                const response = await apiClient.get(`/products/id/${item.productId}`);
                if (response.data.success && response.data.data) {
                    validItems.push(item);
                    console.log(`✅ Valid product: ${item.name}`);
                } else {
                    invalidItems.push(item);
                    console.log(`❌ Invalid product: ${item.name} (${item.productId})`);
                }
            } catch (error) {
                invalidItems.push(item);
                console.log(`❌ Product not found: ${item.name} (${item.productId})`);
            }
        }

        if (invalidItems.length > 0) {
            console.warn(`⚠️ Removed ${invalidItems.length} invalid items from cart:`, invalidItems);
            localStorage.setItem('cart', JSON.stringify(validItems));
            window.dispatchEvent(new Event('cartUpdated'));

            return;
        }

        console.log('✅ All cart items are valid');
    } catch (error) {
        console.error('Cart validation error:', error);
    }
};

/**
 * Clear entire cart
 */
export const clearCart = (): void => {
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
    console.log('🗑️ Cart cleared');
};




