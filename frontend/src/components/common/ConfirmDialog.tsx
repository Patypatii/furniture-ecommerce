'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'info',
}: ConfirmDialogProps) {
    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    const handleCancel = () => {
        onCancel?.();
        onOpenChange(false);
    };

    const variantStyles = {
        danger: 'bg-red-500 hover:bg-red-600',
        warning: 'bg-orange-500 hover:bg-orange-600',
        info: 'bg-primary hover:bg-primary-600',
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <AnimatePresence>
                {open && (
                    <Dialog.Portal forceMount>
                        {/* Overlay */}
                        <Dialog.Overlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                            />
                        </Dialog.Overlay>

                        {/* Content */}
                        <Dialog.Content asChild>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
                            >
                                {/* Close Button */}
                                <Dialog.Close asChild>
                                    <button
                                        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                        aria-label="Close"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </Dialog.Close>

                                {/* Icon */}
                                {variant === 'danger' || variant === 'warning' ? (
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${variant === 'danger' ? 'bg-red-100' : 'bg-orange-100'
                                            }`}
                                    >
                                        <AlertTriangle
                                            className={`w-6 h-6 ${variant === 'danger' ? 'text-red-600' : 'text-orange-600'
                                                }`}
                                        />
                                    </div>
                                ) : null}

                                {/* Title */}
                                <Dialog.Title className="text-xl font-bold text-gray-900 mb-2">
                                    {title}
                                </Dialog.Title>

                                {/* Description */}
                                <Dialog.Description className="text-gray-600 mb-6">
                                    {description}
                                </Dialog.Description>

                                {/* Actions */}
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium text-gray-700"
                                    >
                                        {cancelLabel}
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        className={`px-4 py-2 rounded-lg transition-colors font-medium text-white ${variantStyles[variant]}`}
                                    >
                                        {confirmLabel}
                                    </button>
                                </div>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
}




