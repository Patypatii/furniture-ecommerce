import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderAPI } from '../../services/api';
import { ArrowLeft, Package, User, MapPin, CreditCard, Clock, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function OrderDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [selectedStatus, setSelectedStatus] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [adminNote, setAdminNote] = useState('');

    // Fetch order details
    const { data: order, isLoading } = useQuery({
        queryKey: ['order', id],
        queryFn: () => orderAPI.getById(id!),
        enabled: !!id,
    });

    useEffect(() => {
        if (order) {
            setSelectedStatus(order.status);
        }
    }, [order]);

    // Update order status mutation
    const updateStatusMutation = useMutation({
        mutationFn: async () => {
            return orderAPI.updateStatus(id!, {
                status: selectedStatus,
                message: statusMessage || `Order status updated to ${selectedStatus}`,
            });
        },
        onSuccess: () => {
            toast.success('Order status updated successfully');
            setStatusMessage('');
            queryClient.invalidateQueries({ queryKey: ['order', id] });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to update status');
        },
    });

    // Add admin note mutation
    const addNoteMutation = useMutation({
        mutationFn: async () => {
            return orderAPI.addNote(id!, { message: adminNote });
        },
        onSuccess: () => {
            toast.success('Admin note added successfully');
            setAdminNote('');
            queryClient.invalidateQueries({ queryKey: ['order', id] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to add note');
        },
    });

    const handleUpdateStatus = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStatus) {
            toast.error('Please select a status');
            return;
        }
        updateStatusMutation.mutate();
    };

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!adminNote.trim()) {
            toast.error('Please enter a message');
            return;
        }
        addNoteMutation.mutate();
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
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <p className="ml-3 text-gray-600">Loading order details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Order not found</h3>
                <button
                    onClick={() => navigate('/orders')}
                    className="text-primary hover:underline"
                >
                    Back to Orders
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/orders')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
                        <p className="text-gray-600">
                            {new Date(order.createdAt).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                </div>
                <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Order Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-gray-600" />
                            <h2 className="text-lg font-semibold">Customer Information</h2>
                        </div>
                        <div className="space-y-2">
                            <p className="text-gray-700">
                                <span className="font-medium">Name:</span> {order.shipping.fullName}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-medium">Phone:</span> {order.shipping.phone}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-medium">Email:</span>{' '}
                                {typeof order.user === 'object' && order.user.email ? order.user.email : 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="w-5 h-5 text-gray-600" />
                            <h2 className="text-lg font-semibold">Order Items</h2>
                        </div>
                        <div className="space-y-4">
                            {order.items.map((item: any, index: number) => (
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

                    {/* Addresses */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-gray-600" />
                                <h2 className="text-lg font-semibold">Shipping Address</h2>
                            </div>
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

                        {/* Payment Info */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="w-5 h-5 text-gray-600" />
                                <h2 className="text-lg font-semibold">Payment Information</h2>
                            </div>
                            <div className="text-gray-700 space-y-2">
                                <p>
                                    <span className="font-medium">Method:</span>{' '}
                                    <span className="capitalize">{order.paymentMethod}</span>
                                </p>
                                <p>
                                    <span className="font-medium">Status:</span>{' '}
                                    <span
                                        className={`capitalize ${order.paymentStatus === 'completed'
                                                ? 'text-green-600 font-semibold'
                                                : 'text-yellow-600'
                                            }`}
                                    >
                                        {order.paymentStatus}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-gray-600" />
                            <h2 className="text-lg font-semibold">Order Timeline</h2>
                        </div>
                        <div className="space-y-4">
                            {order.timeline && order.timeline.length > 0 ? (
                                [...order.timeline].reverse().map((event: any, index: number) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex-shrink-0 w-2 h-2 mt-2 bg-primary rounded-full"></div>
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

                    {/* Admin Messages */}
                    {order.adminNotes && order.adminNotes.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <MessageSquare className="w-5 h-5 text-blue-600" />
                                <h2 className="text-lg font-semibold text-blue-900">Admin Messages</h2>
                            </div>
                            <div className="space-y-3">
                                {order.adminNotes.map((note: any, index: number) => (
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

                {/* Right Column - Admin Actions */}
                <div className="space-y-6">
                    {/* Update Status */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Update Order Status</h2>
                        <form onSubmit={handleUpdateStatus} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Status</label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                                <textarea
                                    value={statusMessage}
                                    onChange={(e) => setStatusMessage(e.target.value)}
                                    placeholder="Add a custom message for this status update..."
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                    rows={3}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={updateStatusMutation.isPending}
                                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
                            </button>
                        </form>
                    </div>

                    {/* Add Admin Note */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Send Message to Customer</h2>
                        <form onSubmit={handleAddNote} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Message</label>
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="Enter message for the customer..."
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                    rows={4}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={addNoteMutation.isPending}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {addNoteMutation.isPending ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
