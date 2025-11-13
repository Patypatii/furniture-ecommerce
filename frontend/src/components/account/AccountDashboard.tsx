'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/api/auth.service';
import { authToast } from '@/lib/toast';

export default function AccountDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist'>('profile');
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            // User is not logged in, redirect to login
            authToast.loginRequired('Please login to access your account');
            router.push('/login');
        } else {
            // User is logged in, parse user data
            try {
                const userData = JSON.parse(userStr);
                setUser(userData);
            } catch (error) {
                // Invalid user data, clear and redirect
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                router.push('/login');
            }
        }
        setIsLoading(false);
    }, [router]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    // If no user after loading, return null (redirect is happening)
    if (!user) {
        return null;
    }

    const handleLogout = () => {
        // Clear auth data
        authService.logout();

        // Show success message
        authToast.logoutSuccess();

        // Redirect to home
        router.push('/');
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'orders', label: 'Orders', icon: '📦' },
        { id: 'addresses', label: 'Addresses', icon: '📍' },
        { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
    ] as const;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">My Account</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-4 space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                                    ? 'bg-primary text-white'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                <span className="text-xl">{tab.icon}</span>
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-red-600"
                        >
                            <span className="text-xl">🚪</span>
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    {activeTab === 'profile' && <ProfileTab />}
                    {activeTab === 'orders' && <OrdersTab />}
                    {activeTab === 'addresses' && <AddressesTab />}
                    {activeTab === 'wishlist' && <WishlistTab />}
                </div>
            </div>
        </div>
    );
}

function ProfileTab() {
    return (
        <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                            placeholder="John"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                            placeholder="Doe"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="john@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="+254 700 123 456"
                    />
                </div>
                <button
                    type="submit"
                    className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}

function OrdersTab() {
    // TODO: Fetch orders from API
    const orders = [];

    return (
        <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>
            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                    <Link
                        href="/products"
                        className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Order items would go here */}
                </div>
            )}
        </div>
    );
}

function AddressesTab() {
    return (
        <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Saved Addresses</h2>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors">
                    Add New Address
                </button>
            </div>
            <div className="text-center py-12 text-gray-600">
                No saved addresses yet.
            </div>
        </div>
    );
}

function WishlistTab() {
    return (
        <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
            <div className="text-center py-12">
                <div className="text-6xl mb-4">❤️</div>
                <p className="text-gray-600">Your wishlist is empty.</p>
            </div>
        </div>
    );
}

