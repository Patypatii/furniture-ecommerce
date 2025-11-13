import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    BarChart3,
    Bot,
    Settings,
    LogOut,
    Menu,
    X,
    Shield,
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

const baseNavigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'AI Training', href: '/ai/training', icon: Bot },
];

// Superadmin-only navigation
const superadminNavigation = [
    { name: 'Admin Management', href: '/admins', icon: Shield, superadminOnly: true },
];

const settingsNavigation = [
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Get current user from localStorage
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('admin-user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setCurrentUser(user);
            console.log('Current user role:', user.role);
        }
    }, []);

    const isSuperAdmin = currentUser?.role === 'superadmin';

    // Build navigation array based on user role
    const navigation = useMemo(() => {
        const nav = [...baseNavigation];
        if (isSuperAdmin) {
            console.log('Superadmin detected - adding Admin Management');
            nav.push(...superadminNavigation);
        } else {
            console.log('Regular admin - no Admin Management');
        }
        nav.push(...settingsNavigation);
        console.log('Final navigation:', nav.map(n => n.name));
        return nav;
    }, [isSuperAdmin]);

    const handleLogout = () => {
        localStorage.removeItem('admin-token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg" />
                            <span className="font-bold text-lg">Tangerine</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${isActive
                                            ? 'bg-primary-50 text-primary-600 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }
                  `}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-6">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-4">
                            {currentUser && (
                                <div className="text-sm">
                                    <span className="text-gray-500">{isSuperAdmin ? 'Superadmin' : 'Admin'}:</span>{' '}
                                    <span className="font-medium">{currentUser.firstName} {currentUser.lastName}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

