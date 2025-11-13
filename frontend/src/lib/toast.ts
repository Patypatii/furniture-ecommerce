import { toast as sonnerToast } from 'sonner';

/**
 * Toast notification utility using Sonner
 * Provides consistent toast notifications throughout the app
 */

export const toast = {
    /**
     * Show a success toast
     */
    success: (message: string, description?: string) => {
        sonnerToast.success(message, {
            description,
            duration: 4000,
        });
    },

    /**
     * Show an error toast
     */
    error: (message: string, description?: string) => {
        sonnerToast.error(message, {
            description,
            duration: 5000,
        });
    },

    /**
     * Show an info toast
     */
    info: (message: string, description?: string) => {
        sonnerToast.info(message, {
            description,
            duration: 4000,
        });
    },

    /**
     * Show a warning toast
     */
    warning: (message: string, description?: string) => {
        sonnerToast.warning(message, {
            description,
            duration: 4000,
        });
    },

    /**
     * Show a loading toast
     */
    loading: (message: string) => {
        return sonnerToast.loading(message);
    },

    /**
     * Show a promise toast (auto-updates based on promise state)
     */
    promise: <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: any) => string);
        }
    ) => {
        return sonnerToast.promise(promise, messages);
    },

    /**
     * Dismiss a specific toast
     */
    dismiss: (toastId?: string | number) => {
        sonnerToast.dismiss(toastId);
    },

    /**
     * Custom toast with action button
     */
    custom: (message: string, options?: { action?: { label: string; onClick: () => void }; duration?: number }) => {
        return sonnerToast(message, {
            duration: options?.duration || 4000,
            action: options?.action,
        });
    },
};

/**
 * Cart-specific toast helpers
 */
export const cartToast = {
    added: (productName: string) => {
        toast.success('Added to cart', `${productName} has been added to your cart.`);
    },

    removed: (productName: string) => {
        toast.info('Removed from cart', `${productName} has been removed from your cart.`);
    },

    updated: (productName: string, quantity: number) => {
        toast.success('Cart updated', `${productName} quantity updated to ${quantity}.`);
    },

    error: (message: string = 'Failed to update cart') => {
        toast.error('Cart Error', message);
    },
};

/**
 * Auth-specific toast helpers
 */
export const authToast = {
    loginRequired: (message: string = 'Please log in to continue') => {
        toast.warning('Login Required', message);
    },

    loginSuccess: (name?: string) => {
        toast.success('Welcome back!', name ? `Hi ${name}, you're now logged in.` : 'You are now logged in.');
    },

    logoutSuccess: () => {
        toast.success('Logged out', 'You have been logged out successfully.');
    },

    error: (message: string = 'Authentication failed') => {
        toast.error('Authentication Error', message);
    },
};




