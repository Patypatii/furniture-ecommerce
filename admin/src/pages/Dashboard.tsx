import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
    // Fetch dashboard stats
    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const response = await analyticsAPI.getDashboardStats();
            return response.data.data;
        },
    });

    // Fetch sales data
    const { data: salesData = [], isLoading: salesLoading } = useQuery({
        queryKey: ['sales-data'],
        queryFn: async () => {
            const response = await analyticsAPI.getSalesData('6months');
            return response.data.data;
        },
    });

    // Fetch top products
    const { data: topProducts = [], isLoading: productsLoading } = useQuery({
        queryKey: ['top-products'],
        queryFn: async () => {
            const response = await analyticsAPI.getTopProducts(4);
            return response.data.data;
        },
    });

    // Fetch recent orders
    const { data: recentOrders = [], isLoading: ordersLoading } = useQuery({
        queryKey: ['recent-orders'],
        queryFn: async () => {
            const response = await analyticsAPI.getRecentOrders(5);
            return response.data.data;
        },
    });

    // Build stats array from API data
    const stats = statsData ? [
        {
            name: 'Total Revenue',
            value: statsData.totalRevenue.formatted,
            change: statsData.totalRevenue.change,
            icon: DollarSign,
            color: 'bg-green-500',
        },
        {
            name: 'Orders',
            value: statsData.totalOrders.formatted,
            change: statsData.totalOrders.change,
            icon: ShoppingCart,
            color: 'bg-blue-500',
        },
        {
            name: 'Products',
            value: statsData.totalProducts.formatted,
            change: statsData.totalProducts.change,
            icon: Package,
            color: 'bg-purple-500',
        },
        {
            name: 'Customers',
            value: statsData.totalCustomers.formatted,
            change: statsData.totalCustomers.change,
            icon: Users,
            color: 'bg-orange-500',
        },
    ] : [];

    if (statsLoading) {
        return (
            <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 h-32 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }
    // Get current user for role display
    const currentUser = (() => {
        const userStr = localStorage.getItem('admin-user');
        return userStr ? JSON.parse(userStr) : null;
    })();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Role Badge */}
            {currentUser && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${currentUser.role === 'superadmin'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                    <span className="text-lg">{currentUser.role === 'superadmin' ? '👑' : '🛡️'}</span>
                    <div>
                        <p className="font-medium text-sm">
                            Logged in as: {currentUser.role === 'superadmin' ? 'Superadmin' : 'Admin'}
                        </p>
                        <p className="text-xs opacity-75">{currentUser.firstName} {currentUser.lastName}</p>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{stat.name}</p>
                                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="sales" stroke="#f58705" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Top Products</h3>
                    <div className="space-y-4">
                        {topProducts.map((product, index) => (
                            <div key={product.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium">{product.name}</p>
                                        <p className="text-sm text-gray-500">{product.sales} sales</p>
                                    </div>
                                </div>
                                <p className="font-semibold">{product.revenue}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                {ordersLoading ? (
                    <div className="animate-pulse space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded" />
                        ))}
                    </div>
                ) : recentOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                                    <th className="pb-3">Order ID</th>
                                    <th className="pb-3">Customer</th>
                                    <th className="pb-3">Items</th>
                                    <th className="pb-3">Amount</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {recentOrders.map((order: any) => (
                                    <tr key={order._id} className="border-b border-gray-100">
                                        <td className="py-3 font-medium">#{order.orderNumber || order._id.slice(-8)}</td>
                                        <td className="py-3">
                                            {order.user ? `${order.user.firstName} ${order.user.lastName}` : order.shippingAddress?.fullName || 'Guest'}
                                        </td>
                                        <td className="py-3">{order.items?.length || 0} items</td>
                                        <td className="py-3">KES {order.total?.toLocaleString() || '0'}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'completed' || order.status === 'delivered'
                                                ? 'bg-green-100 text-green-700'
                                                : order.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : order.status === 'processing'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                {order.status || 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No orders yet
                    </div>
                )}
            </div>
        </div>
    );
}

