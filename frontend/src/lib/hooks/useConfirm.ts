import { useState, useCallback } from 'react';

interface ConfirmOptions {
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
}

interface ConfirmState extends ConfirmOptions {
    open: boolean;
    resolve?: (value: boolean) => void;
}

export function useConfirm() {
    const [state, setState] = useState<ConfirmState>({
        open: false,
        title: '',
        description: '',
        confirmLabel: 'Confirm',
        cancelLabel: 'Cancel',
        variant: 'info',
    });

    const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setState({
                open: true,
                ...options,
                resolve,
            });
        });
    }, []);

    const handleConfirm = useCallback(() => {
        state.resolve?.(true);
        setState((prev) => ({ ...prev, open: false }));
    }, [state.resolve]);

    const handleCancel = useCallback(() => {
        state.resolve?.(false);
        setState((prev) => ({ ...prev, open: false }));
    }, [state.resolve]);

    const handleOpenChange = useCallback((open: boolean) => {
        if (!open) {
            state.resolve?.(false);
        }
        setState((prev) => ({ ...prev, open }));
    }, [state.resolve]);

    return {
        confirm,
        confirmState: state,
        handleConfirm,
        handleCancel,
        handleOpenChange,
    };
}




