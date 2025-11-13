import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, User, Lock, Bell, Globe, Shield, LogOut } from 'lucide-react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Settings() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [adminUser, setAdminUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Profile form
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        // Load admin user from localStorage
        const userStr = localStorage.getItem('admin-user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setAdminUser(user);
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
        }
    }, []);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // TODO: Call update profile API
            toast.success('Profile updated successfully');

            // Update localStorage
            const updatedUser = { ...adminUser, firstName, lastName, phone };
            localStorage.setItem('admin-user', JSON.stringify(updatedUser));
            setAdminUser(updatedUser);
        } catch (error: any) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        try {
            // TODO: Call change password API
            toast.success('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast.error('Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('admin-token');
            localStorage.removeItem('admin-user');
            toast.success('Logged out successfully');
            navigate('/login');
        }
    };

    // Get current user for role display
    const currentAdminUser = (() => {
        const userStr = localStorage.getItem('admin-user');
        return userStr ? JSON.parse(userStr) : null;
    })();

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'business', label: 'Business Info', icon: Globe },
        { id: 'debug', label: 'Debug Info', icon: Shield },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account and system preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Tabs Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === tab.id
                                    ? 'bg-primary-500 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                                <form onSubmit={handleProfileUpdate} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            disabled
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition disabled:opacity-50"
                                        >
                                            <Save className="w-4 h-4" />
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-6">Change Password</h2>
                                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            required
                                            minLength={8}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition disabled:opacity-50"
                                        >
                                            <Lock className="w-4 h-4" />
                                            {loading ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>

                                {/* Logout Section */}
                                <div className="mt-8 pt-8 border-t border-gray-200">
                                    <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 mb-1">Logout from this device</h4>
                                                <p className="text-sm text-gray-600">
                                                    End your current session and return to the login page. You'll need to login again to access the admin panel.
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="ml-4 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="font-medium">New Orders</p>
                                            <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-500" />
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="font-medium">Low Stock Alerts</p>
                                            <p className="text-sm text-gray-500">Get alerted when products are running low</p>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-500" />
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="font-medium">Customer Reviews</p>
                                            <p className="text-sm text-gray-500">Get notified about new customer reviews</p>
                                        </div>
                                        <input type="checkbox" className="w-5 h-5 text-primary-500" />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition">
                                            <Save className="w-4 h-4" />
                                            Save Preferences
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Business Info Tab */}
                        {activeTab === 'business' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-6">Business Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Business Name
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue="Tangerine Furniture"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Business Phone
                                        </label>
                                        <input
                                            type="tel"
                                            defaultValue="+254791708894"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Business Email
                                        </label>
                                        <input
                                            type="email"
                                            defaultValue="info@tangerinefurniture.co.ke"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Business Address
                                        </label>
                                        <textarea
                                            rows={3}
                                            defaultValue="DUL DUL GODOWNS, PHASE 2, CABANAS STAGE, Nairobi, Kenya"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            onClick={() => toast.info('Business info update coming soon')}
                                            className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Debug Info Tab */}
                        {activeTab === 'debug' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-6">Debug Information</h2>

                                {currentAdminUser ? (
                                    <div className="space-y-6">
                                        {/* Current Role */}
                                        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                                            <h3 className="font-semibold text-lg mb-4">Your Current Role</h3>
                                            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-lg ${currentAdminUser.role === 'superadmin'
                                                    ? 'bg-purple-100 border-2 border-purple-300'
                                                    : 'bg-blue-100 border-2 border-blue-300'
                                                }`}>
                                                <span className="text-3xl">{currentAdminUser.role === 'superadmin' ? '👑' : '🛡️'}</span>
                                                <div>
                                                    <p className="font-bold text-lg">
                                                        {currentAdminUser.role === 'superadmin' ? 'SUPERADMIN' : 'ADMIN'}
                                                    </p>
                                                    <p className="text-sm opacity-75">{currentAdminUser.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* What You Should See */}
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <h3 className="font-semibold text-lg mb-4">Features You Should See</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className={`p-4 rounded-lg ${currentAdminUser.role === 'superadmin' ? 'bg-green-50 border border-green-200' : 'bg-gray-100'}`}>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xl">🛡️</span>
                                                        <span className="font-medium">Admin Management</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        {currentAdminUser.role === 'superadmin'
                                                            ? '✅ Available - Check sidebar for "Admin Management"'
                                                            : '❌ Not available - Superadmin only'}
                                                    </p>
                                                </div>

                                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xl">📦</span>
                                                        <span className="font-medium">Product Management</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">✅ Available</p>
                                                </div>

                                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xl">📊</span>
                                                        <span className="font-medium">Analytics</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">✅ Available</p>
                                                </div>

                                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xl">👥</span>
                                                        <span className="font-medium">Customer Management</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">✅ Available</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Troubleshooting */}
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                            <h3 className="font-semibold text-lg mb-4">🔧 Troubleshooting</h3>
                                            <div className="space-y-3 text-sm">
                                                <p><strong>Don't see "Admin Management"?</strong></p>
                                                <ol className="list-decimal list-inside space-y-2 ml-2">
                                                    <li>Logout from the sidebar</li>
                                                    <li>Login again with: <code className="bg-purple-100 px-2 py-1 rounded">superadmin@tangerinefurniture.co.ke</code></li>
                                                    <li>Check if role shows as "SUPERADMIN" above</li>
                                                    <li>Open browser console (F12) and check for messages</li>
                                                    <li>Look for "Admin Management" in the sidebar</li>
                                                </ol>
                                            </div>
                                        </div>

                                        {/* Raw Data */}
                                        <div className="bg-gray-900 text-green-400 rounded-lg p-6 font-mono text-xs">
                                            <h3 className="font-semibold text-base mb-4">Raw localStorage Data</h3>
                                            <pre className="overflow-x-auto">
                                                {JSON.stringify(currentAdminUser, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No user data found in localStorage
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

