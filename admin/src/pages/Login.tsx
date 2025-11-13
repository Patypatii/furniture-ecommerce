import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
            });

            if (response.data.success) {
                const { token, user } = response.data.data;

                // Check if user is admin or superadmin
                if (user.role === 'admin' || user.role === 'superadmin') {
                    // Store token and user data
                    localStorage.setItem('admin-token', token);
                    localStorage.setItem('admin-user', JSON.stringify(user));

                    toast.success(`Welcome back, ${user.firstName}!`);

                    // Redirect to dashboard
                    setTimeout(() => {
                        navigate('/');
                    }, 500);
                } else {
                    toast.error('Access denied. Admin privileges required.');
                }
            }
        } catch (error: any) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.error || 'Invalid email or password';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900">Tangerine Furniture</h1>
                    <p className="text-gray-500 mt-2">Admin Dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="admin@tangerinefurniture.co.ke"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-500 text-white py-2 rounded-lg font-medium hover:bg-primary-600 transition disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 space-y-3">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium mb-2">
                            👤 Admin Credentials:
                        </p>
                        <p className="text-xs text-blue-700">
                            📧 admin@tangerinefurniture.co.ke
                        </p>
                        <p className="text-xs text-blue-700">
                            🔑 Admin@123456
                        </p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-800 font-medium mb-2">
                            👑 Superadmin Credentials:
                        </p>
                        <p className="text-xs text-purple-700">
                            📧 superadmin@tangerinefurniture.co.ke
                        </p>
                        <p className="text-xs text-purple-700">
                            🔑 SuperAdmin@123456
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

