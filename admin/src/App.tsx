import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Products/ProductList';
import ProductForm from './pages/Products/ProductForm';
import OrderList from './pages/Orders/OrderList';
import OrderDetails from './pages/Orders/OrderDetails';
import Customers from './pages/Customers';
import Analytics from './pages/Analytics';
import ChatbotTraining from './pages/AI/ChatbotTraining';
import ConversationLogs from './pages/AI/ConversationLogs';
import Settings from './pages/Settings';
import AdminManagement from './pages/AdminManagement';
import Login from './pages/Login';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    // Simple auth check (replace with proper auth)
    const isAuthenticated = localStorage.getItem('admin-token');

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    {/* Protected routes */}
                    <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
                        <Route index element={<Dashboard />} />

                        {/* Products */}
                        <Route path="products" element={<ProductList />} />
                        <Route path="products/new" element={<ProductForm />} />
                        <Route path="products/:id/edit" element={<ProductForm />} />

                        {/* Orders */}
                        <Route path="orders" element={<OrderList />} />
                        <Route path="orders/:id" element={<OrderDetails />} />

                        {/* Customers */}
                        <Route path="customers" element={<Customers />} />

                        {/* Analytics */}
                        <Route path="analytics" element={<Analytics />} />

                        {/* AI */}
                        <Route path="ai/training" element={<ChatbotTraining />} />
                        <Route path="ai/conversations" element={<ConversationLogs />} />

                        {/* Admin Management (Superadmin only) */}
                        <Route path="admins" element={<AdminManagement />} />

                        {/* Settings */}
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Routes>
            </Router>
            <Toaster position="top-right" />
        </QueryClientProvider>
    );
}

export default App;

