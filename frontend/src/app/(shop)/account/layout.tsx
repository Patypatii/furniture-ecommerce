'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/api/auth.service';
import { authToast } from '@/lib/toast';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
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

    const handleLogout = () => {
        // Clear auth data
        authService.logout();

        // Show success message
        authToast.logoutSuccess();

        // Redirect to home
        router.push('/');
    };

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 pb-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    // If no user after loading, return null (redirect is happening)
    if (!user) {
        return null;
    }

    const navigation = [
        { name: 'Profile', href: '/account', icon: '👤' },
        { name: 'Orders', href: '/account/orders', icon: '📦' },
        { name: 'Wishlist', href: '/account/wishlist', icon: '❤️' },
        { name: 'Inbox', href: '/account/inbox', icon: '✉️' },
    ];

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">My Account</h1>
                    <p className="text-gray-600 mt-1">Welcome back, {user.firstName}!</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-4 space-y-2 sticky top-24">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                                ? 'bg-primary text-white'
                                                : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}
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
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

