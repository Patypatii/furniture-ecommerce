'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { orderService } from '@/lib/api/order.service';
import { IOrder } from '@tangerine/shared';
import { toast } from '@/lib/toast';

export default function OrdersPage() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setIsLoading(true);
            const response = await orderService.getMyOrders();
            setOrders(response.data || []);
        } catch (error: any) {
            console.error('Failed to load orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'processing': return 'bg-purple-100 text-purple-800';
            case 'shipped': return 'bg-indigo-100 text-indigo-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    <p className="ml-3 text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">My Orders</h2>

            {orders.length === 0 ? (
                /* Empty State */
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-2xl font-semibold mb-4">No orders yet</h3>
                    <p className="text-gray-600 mb-8">
                        When you place orders, they will appear here.
                    </p>
                    <Link
                        href="/products"
                        className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                /* Orders List */
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Link
                            key={order._id}
                            href={`/account/orders/${order._id}`}
                            className="block border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                                    <p className="text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                </div>
                                <div className="text-lg font-bold text-primary">
                                    KES {order.total.toLocaleString()}
                                </div>
                            </div>

                            {/* Show latest timeline message if exists */}
                            {order.timeline && order.timeline.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Latest update:</span>{' '}
                                        {order.timeline[order.timeline.length - 1].message}
                                    </p>
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

