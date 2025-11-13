'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { orderService } from '@/lib/api/order.service';
import { IOrder } from '@tangerine/shared';
import { toast } from '@/lib/toast';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<IOrder | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            loadOrder(params.id as string);
        }
    }, [params.id]);

    const loadOrder = async (orderId: string) => {
        try {
            setIsLoading(true);
            const orderData = await orderService.getOrder(orderId);
            setOrder(orderData);
        } catch (error: any) {
            console.error('Failed to load order:', error);
            toast.error('Failed to load order details');
            router.push('/account/orders');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-600" />;
            case 'confirmed':
            case 'processing':
                return <Package className="w-5 h-5 text-blue-600" />;
            case 'shipped':
                return <Truck className="w-5 h-5 text-indigo-600" />;
            case 'delivered':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'cancelled':
                return <XCircle className="w-5 h-5 text-red-600" />;
            default:
                return <Clock className="w-5 h-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'processing':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'shipped':
                return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    <p className="ml-3 text-gray-600">Loading order...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <Link
                    href="/account/orders"
                    className="inline-flex items-center text-primary hover:text-primary-600 mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Orders
                </Link>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Order {order.orderNumber}</h1>
                        <p className="text-gray-600">
                            Placed on{' '}
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                    <div
                        className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(
                            order.status
                        )}`}
                    >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Order Timeline</h2>
                <div className="space-y-4">
                    {order.timeline && order.timeline.length > 0 ? (
                        [...order.timeline].reverse().map((event, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="flex-shrink-0">{getStatusIcon(event.status)}</div>
                                <div className="flex-1">
                                    <p className="font-medium">{event.message}</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(event.timestamp).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No timeline updates yet</p>
                    )}
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-0">
                            <img
                                src={item.image || '/placeholder.jpg'}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-sm text-gray-600">
                                    Quantity: {item.quantity} × KES {item.price.toLocaleString()}
                                </p>
                            </div>
                            <div className="font-semibold">KES {item.subtotal.toLocaleString()}</div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t space-y-2">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal:</span>
                        <span>KES {order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping:</span>
                        <span>KES {order.shippingCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Tax:</span>
                        <span>KES {order.tax.toLocaleString()}</span>
                    </div>
                    {order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount:</span>
                            <span>-KES {order.discount.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-xl font-bold pt-2 border-t">
                        <span>Total:</span>
                        <span>KES {order.total.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Shipping & Billing */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                    <div className="text-gray-700 space-y-1">
                        <p className="font-medium">{order.shipping.fullName}</p>
                        <p>{order.shipping.phone}</p>
                        <p>{order.shipping.addressLine1}</p>
                        {order.shipping.addressLine2 && <p>{order.shipping.addressLine2}</p>}
                        <p>
                            {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}
                        </p>
                        <p>{order.shipping.country}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                    <p className="text-gray-700 capitalize">{order.paymentMethod}</p>
                    <p className="text-sm text-gray-600 mt-2">
                        Payment Status:{' '}
                        <span
                            className={`font-medium ${order.paymentStatus === 'paid'
                                    ? 'text-green-600'
                                    : 'text-yellow-600'
                                }`}
                        >
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                    </p>
                </div>
            </div>

            {/* Admin Messages */}
            {order.adminNotes && order.adminNotes.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-blue-900">Messages from Admin</h2>
                    <div className="space-y-3">
                        {order.adminNotes.map((note, index) => (
                            <div key={index} className="bg-white rounded p-4">
                                <p className="text-gray-800">{note.message}</p>
                                <p className="text-sm text-gray-600 mt-2">
                                    {new Date(note.timestamp).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
