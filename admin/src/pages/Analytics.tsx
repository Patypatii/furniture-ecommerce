import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, DollarSign, ShoppingCart, Package, Users, Loader2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { analyticsAPI } from '../services/api';

const COLORS = ['#f58705', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export default function Analytics() {
    const [period, setPeriod] = useState('6months');

    // Fetch dashboard stats
    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ['analytics-stats'],
        queryFn: async () => {
            const response = await analyticsAPI.getDashboardStats();
            return response.data.data;
        },
    });

    // Fetch sales data
    const { data: salesData = [], isLoading: salesLoading } = useQuery({
        queryKey: ['analytics-sales', period],
        queryFn: async () => {
            const response = await analyticsAPI.getSalesData(period);
            return response.data.data;
        },
    });

    // Fetch top products
    const { data: topProducts = [], isLoading: productsLoading } = useQuery({
        queryKey: ['analytics-top-products'],
        queryFn: async () => {
            const response = await analyticsAPI.getTopProducts(10);
            return response.data.data;
        },
    });

    if (statsLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-500 mt-1">In-depth business analytics and insights</p>
                </div>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="3months">Last 3 Months</option>
                    <option value="6months">Last 6 Months</option>
                    <option value="1year">Last Year</option>
                </select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsData && [
                    {
                        name: 'Total Revenue',
                        value: statsData.totalRevenue.formatted,
                        change: statsData.totalRevenue.change,
                        icon: DollarSign,
                        color: 'bg-green-500',
                    },
                    {
                        name: 'Total Orders',
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
                ].map((stat) => (
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
                {/* Sales Trend Chart */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
                    {salesLoading ? (
                        <div className="h-80 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                        </div>
                    ) : salesData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`KES ${Number(value).toLocaleString()}`, 'Sales']} />
                                <Line type="monotone" dataKey="sales" stroke="#f58705" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-80 flex items-center justify-center text-gray-400">
                            No sales data available
                        </div>
                    )}
                </div>

                {/* Top Products Chart */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
                    {productsLoading ? (
                        <div className="h-80 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                        </div>
                    ) : topProducts.length > 0 ? (
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={topProducts.slice(0, 5)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="sales" fill="#f58705" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-80 flex items-center justify-center text-gray-400">
                            No product data available
                        </div>
                    )}
                </div>
            </div>

            {/* Top Products Table */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Top 10 Products by Sales</h3>
                {productsLoading ? (
                    <div className="p-4">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-500" />
                    </div>
                ) : topProducts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-200">
                                <tr className="text-left text-sm text-gray-500">
                                    <th className="pb-3">Rank</th>
                                    <th className="pb-3">Product</th>
                                    <th className="pb-3">Sales</th>
                                    <th className="pb-3">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((product: any, index: number) => (
                                    <tr key={product.name} className="border-b border-gray-100">
                                        <td className="py-3">
                                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="py-3 font-medium">{product.name}</td>
                                        <td className="py-3 text-gray-600">{product.sales}</td>
                                        <td className="py-3 font-semibold text-primary-600">{product.revenue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-400 py-8">No product data</p>
                )}
            </div>
        </div>
    );
}

