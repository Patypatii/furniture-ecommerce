import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Mail, Phone, Calendar, Loader2, Users } from 'lucide-react';
import { userAPI } from '../services/api';
import { format } from 'date-fns';

export default function Customers() {
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch customers
    const { data: customersData, isLoading } = useQuery({
        queryKey: ['admin-customers', searchQuery],
        queryFn: async () => {
            const params: any = { role: 'customer' };
            if (searchQuery) params.search = searchQuery;
            
            const response = await userAPI.getAll(params);
            return response.data;
        },
    });

    const customers = customersData?.data || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                <p className="text-gray-500 mt-1">Manage your customer base</p>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search customers by name or email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Customers</p>
                            <p className="text-2xl font-bold mt-2">{customers.length}</p>
                        </div>
                        <div className="bg-blue-500 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Active This Month</p>
                            <p className="text-2xl font-bold mt-2">
                                {customers.filter((c: any) => {
                                    const lastLogin = c.lastLogin ? new Date(c.lastLogin) : null;
                                    if (!lastLogin) return false;
                                    const monthAgo = new Date();
                                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                                    return lastLogin > monthAgo;
                                }).length}
                            </p>
                        </div>
                        <div className="bg-green-500 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">New This Week</p>
                            <p className="text-2xl font-bold mt-2">
                                {customers.filter((c: any) => {
                                    const created = new Date(c.createdAt);
                                    const weekAgo = new Date();
                                    weekAgo.setDate(weekAgo.getDate() - 7);
                                    return created > weekAgo;
                                }).length}
                            </p>
                        </div>
                        <div className="bg-purple-500 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" />
                        <p className="text-gray-500 mt-2">Loading customers...</p>
                    </div>
                ) : customers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p>No customers found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr className="text-left text-sm text-gray-500">
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Contact</th>
                                    <th className="p-4">Joined</th>
                                    <th className="p-4">Last Login</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer: any) => (
                                    <tr key={customer._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                    <span className="text-primary-600 font-semibold">
                                                        {customer.firstName?.[0]}{customer.lastName?.[0]}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {customer.firstName} {customer.lastName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{customer.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1 text-sm">
                                                {customer.email && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Mail className="w-4 h-4" />
                                                        {customer.email}
                                                    </div>
                                                )}
                                                {customer.phone && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Phone className="w-4 h-4" />
                                                        {customer.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {customer.lastLogin 
                                                ? format(new Date(customer.lastLogin), 'MMM dd, yyyy')
                                                : 'Never'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                customer.isActive 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {customer.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

