import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, Loader2, Shield, Key } from 'lucide-react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminManagement() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
    const queryClient = useQueryClient();

    // Check if current user is superadmin
    const currentUser = JSON.parse(localStorage.getItem('admin-user') || '{}');
    const isSuperAdmin = currentUser.role === 'superadmin';

    // Fetch admins
    const { data: adminsData, isLoading } = useQuery({
        queryKey: ['admins'],
        queryFn: async () => {
            const response = await adminAPI.getAll();
            return response.data;
        },
        enabled: isSuperAdmin,
    });

    // Delete admin mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => adminAPI.delete(id),
        onSuccess: () => {
            toast.success('Admin deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['admins'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to delete admin');
        },
    });

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete admin "${name}"?`)) {
            deleteMutation.mutate(id);
        }
    };

    const admins = adminsData?.data || [];
    const filteredAdmins = admins.filter((admin: any) =>
        `${admin.firstName} ${admin.lastName} ${admin.email}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    if (!isSuperAdmin) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600">Only superadmins can access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
                    <p className="text-gray-500 mt-1">Manage admin users and their permissions</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
                >
                    <Plus className="w-5 h-5" />
                    Add Admin
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search admins by name or email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>

            {/* Admins Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" />
                        <p className="text-gray-500 mt-2">Loading admins...</p>
                    </div>
                ) : filteredAdmins.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No admins found
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-left text-sm text-gray-500">
                                <th className="p-4">Admin</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Created</th>
                                <th className="p-4">Last Login</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAdmins.map((admin: any) => (
                                <tr key={admin._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                <span className="text-primary-600 font-semibold">
                                                    {admin.firstName?.[0]}{admin.lastName?.[0]}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {admin.firstName} {admin.lastName}
                                                </p>
                                                <p className="text-sm text-gray-500">{admin.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${admin.role === 'superadmin'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {format(new Date(admin.createdAt), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {admin.lastLogin
                                            ? format(new Date(admin.lastLogin), 'MMM dd, yyyy')
                                            : 'Never'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${admin.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {admin.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedAdmin(admin);
                                                    setShowPasswordModal(true);
                                                }}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                                                title="Change Password"
                                            >
                                                <Key className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(admin._id, `${admin.firstName} ${admin.lastName}`)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                                                disabled={deleteMutation.isPending || admin._id === currentUser._id}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create Admin Modal */}
            {showCreateModal && (
                <CreateAdminModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        queryClient.invalidateQueries({ queryKey: ['admins'] });
                    }}
                />
            )}

            {/* Change Password Modal */}
            {showPasswordModal && selectedAdmin && (
                <ChangePasswordModal
                    admin={selectedAdmin}
                    onClose={() => {
                        setShowPasswordModal(false);
                        setSelectedAdmin(null);
                    }}
                />
            )}
        </div>
    );
}

// Create Admin Modal Component
function CreateAdminModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'admin' as 'admin' | 'superadmin',
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => adminAPI.create(data),
        onSuccess: () => {
            toast.success('Admin created successfully');
            onSuccess();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to create admin');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Create New Admin</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            minLength={8}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'superadmin' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="admin">Admin</option>
                            <option value="superadmin">Superadmin</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition disabled:opacity-50"
                        >
                            {createMutation.isPending ? 'Creating...' : 'Create Admin'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Change Password Modal Component
function ChangePasswordModal({ admin, onClose }: { admin: any; onClose: () => void }) {
    const [newPassword, setNewPassword] = useState('');

    const changePasswordMutation = useMutation({
        mutationFn: () => adminAPI.changePassword(admin._id, newPassword),
        onSuccess: () => {
            toast.success('Password changed successfully');
            onClose();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to change password');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
        changePasswordMutation.mutate();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Change Password</h2>
                <p className="text-gray-600 mb-4">
                    Changing password for: <strong>{admin.firstName} {admin.lastName}</strong>
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            minLength={8}
                            placeholder="Min 8 characters"
                            required
                        />
                    </div>
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={changePasswordMutation.isPending}
                            className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition disabled:opacity-50"
                        >
                            {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

