import { cartService } from '@/lib/api/cart.service';

/**
 * Sync localStorage cart to backend database
 * Should be called when user logs in or when cart changes while logged in
 */
export const syncCartToBackend = async (): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('User not logged in, skipping cart sync');
            return;
        }

        const localCart = localStorage.getItem('cart');
        if (!localCart) {
            console.log('No local cart to sync');
            return;
        }

        const cartItems = JSON.parse(localCart);
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            console.log('Cart is empty, nothing to sync');
            return;
        }

        console.log('🔄 Syncing cart to backend...', cartItems);

        // Add each item to backend cart
        for (const item of cartItems) {
            try {
                await cartService.addToCart({
                    productId: item.productId || item.product,
                    quantity: item.quantity,
                });
            } catch (error: any) {
                console.error(`Failed to sync item: ${item.name}`, error);
                // Continue with other items even if one fails
            }
        }

        console.log('✅ Cart synced to backend successfully');
    } catch (error) {
        console.error('Cart sync error:', error);
        // Don't throw - cart sync is not critical
    }
};

/**
 * Sync backend cart to localStorage
 * Should be called after login to get user's cart from database
 */
export const syncCartFromBackend = async (): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }

        console.log('🔄 Fetching cart from backend...');

        const backendCart = await cartService.getCart();

        if (backendCart && backendCart.items && backendCart.items.length > 0) {
            // Convert backend cart to localStorage format
            const localCartFormat = backendCart.items.map(item => ({
                productId: item.product,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity,
                slug: item.slug,
            }));

            // Merge with existing local cart (if any)
            const existingLocalCart = JSON.parse(localStorage.getItem('cart') || '[]');

            const mergedCart = [...localCartFormat];

            // Add items from localStorage that aren't in backend
            for (const localItem of existingLocalCart) {
                const exists = mergedCart.find(item => item.productId === localItem.productId);
                if (!exists) {
                    mergedCart.push(localItem);
                }
            }

            localStorage.setItem('cart', JSON.stringify(mergedCart));
            window.dispatchEvent(new Event('cartUpdated'));

            console.log('✅ Cart synced from backend:', mergedCart);
        }
    } catch (error) {
        console.error('Failed to sync cart from backend:', error);
        // Don't clear local cart if backend sync fails
    }
};




