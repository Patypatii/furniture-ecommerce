'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Check } from 'lucide-react';
import { IAddress } from '@tangerine/shared';
import { toast } from '@/lib/toast';
import { useConfirm } from '@/lib/hooks/useConfirm';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { userService } from '@/lib/api/user.service';

interface AddressManagerProps {
    onSelectAddress?: (address: IAddress) => void;
    selectionMode?: boolean;
}

export default function AddressManager({ onSelectAddress, selectionMode = false }: AddressManagerProps) {
    const [addresses, setAddresses] = useState<IAddress[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const { confirm, confirmState, handleConfirm, handleCancel, handleOpenChange } = useConfirm();

    const [formData, setFormData] = useState<Partial<IAddress>>({
        type: 'shipping',
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Kenya',
        isDefault: false,
    });

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            // Fetch user profile from API (includes addresses)
            const user = await userService.getProfile();
            setAddresses(user.addresses || []);

            // Set default address as selected
            const defaultAddr = user.addresses?.find((a: IAddress) => a.isDefault);
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr._id);
            }
        } catch (error) {
            console.error('Failed to load addresses:', error);
            setAddresses([]);
        }
    };

    const resetForm = () => {
        setFormData({
            type: 'shipping',
            fullName: '',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'Kenya',
            isDefault: false,
        });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleSave = async () => {
        // Validation
        if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.city) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const addressData = {
                type: formData.type,
                fullName: formData.fullName,
                phone: formData.phone,
                addressLine1: formData.addressLine1,
                addressLine2: formData.addressLine2,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                country: formData.country,
                isDefault: formData.isDefault,
            };

            if (editingId) {
                // Update via API
                const response = await userService.updateAddress(editingId, addressData);
                setAddresses(response.data);
                toast.success('Address updated successfully');
            } else {
                // Add via API
                const response = await userService.addAddress(addressData);
                setAddresses(response.data);
                toast.success('Address added successfully');
            }

            resetForm();
        } catch (error: any) {
            console.error('Address save error:', error);
            toast.error(error.response?.data?.error || 'Failed to save address');
        }
    };

    const handleEdit = (address: IAddress) => {
        setFormData(address);
        setEditingId(address._id);
        setIsAdding(true);
    };

    const handleDelete = async (address: IAddress) => {
        const confirmed = await confirm({
            title: 'Delete Address',
            description: `Are you sure you want to delete this address?\n\n${address.fullName}\n${address.addressLine1}, ${address.city}`,
            confirmLabel: 'Delete',
            cancelLabel: 'Cancel',
            variant: 'danger',
        });

        if (!confirmed) return;

        try {
            // Delete via API
            const response = await userService.deleteAddress(address._id);
            setAddresses(response.data);
            toast.success('Address deleted successfully');
        } catch (error: any) {
            console.error('Address delete error:', error);
            toast.error(error.response?.data?.error || 'Failed to delete address');
        }
    };

    const handleSelectAddress = (address: IAddress) => {
        setSelectedAddressId(address._id);
        if (onSelectAddress) {
            onSelectAddress(address);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                    {selectionMode ? 'Select Shipping Address' : 'My Addresses'}
                </h2>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Address
                    </button>
                )}
            </div>

            {/* Address Form */}
            {isAdding && (
                <div className="bg-white border-2 border-primary rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingId ? 'Edit Address' : 'New Address'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Full Name *</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Phone *</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="+254 700 123 456"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Address Line 1 *</label>
                            <input
                                type="text"
                                value={formData.addressLine1}
                                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="Street address, building, etc."
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Address Line 2</label>
                            <input
                                type="text"
                                value={formData.addressLine2 || ''}
                                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="Apartment, suite, unit, etc."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">City *</label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">State/County *</label>
                            <input
                                type="text"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Postal Code *</label>
                            <input
                                type="text"
                                value={formData.postalCode}
                                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Country</label>
                            <input
                                type="text"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isDefault || false}
                                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                    className="w-4 h-4 text-primary"
                                />
                                <span className="text-sm font-medium">Set as default address</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition font-medium"
                        >
                            {editingId ? 'Update Address' : 'Save Address'}
                        </button>
                        <button
                            onClick={resetForm}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Saved Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                    <div
                        key={address._id}
                        onClick={() => selectionMode && handleSelectAddress(address)}
                        className={`bg-white border-2 rounded-lg p-4 transition ${selectionMode
                                ? 'cursor-pointer hover:border-primary hover:shadow-md'
                                : 'border-gray-200'
                            } ${selectedAddressId === address._id && selectionMode
                                ? 'border-primary bg-primary/5 shadow-md'
                                : ''
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <span className="font-semibold">{address.fullName}</span>
                                    {address.isDefault && (
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                            Default
                                        </span>
                                    )}
                                    {selectedAddressId === address._id && selectionMode && (
                                        <div className="ml-auto">
                                            <Check className="w-6 h-6 text-primary" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600">{address.phone}</p>
                                <p className="text-sm text-gray-700 mt-2">
                                    {address.addressLine1}
                                    {address.addressLine2 && `, ${address.addressLine2}`}
                                </p>
                                <p className="text-sm text-gray-700">
                                    {address.city}, {address.state} {address.postalCode}
                                </p>
                                <p className="text-sm text-gray-700">{address.country}</p>
                            </div>

                            {!selectionMode && (
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(address)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                                        title="Edit address"
                                    >
                                        <Edit className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                                        title="Delete address"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {addresses.length === 0 && !isAdding && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No addresses saved</h3>
                    <p className="text-gray-500 mb-4">Add your first address to make checkout faster</p>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition font-medium"
                    >
                        Add Address
                    </button>
                </div>
            )}

            {/* Confirmation Dialog */}
            <ConfirmDialog
                open={confirmState.open}
                onOpenChange={handleOpenChange}
                title={confirmState.title}
                description={confirmState.description}
                confirmLabel={confirmState.confirmLabel}
                cancelLabel={confirmState.cancelLabel}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                variant={confirmState.variant}
            />
        </div>
    );
}

