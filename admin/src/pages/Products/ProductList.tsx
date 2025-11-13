import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react';
import { productAPI, categoryAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ProductList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const queryClient = useQueryClient();

    // Fetch products
    const { data: productsData, isLoading } = useQuery({
        queryKey: ['admin-products', searchQuery, selectedCategory],
        queryFn: async () => {
            const params: any = {};
            if (searchQuery) params.search = searchQuery;
            if (selectedCategory) params.category = selectedCategory;

            const response = await productAPI.getAll(params);
            return response.data;
        },
    });

    // Fetch categories
    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await categoryAPI.getAll();
            return response.data;
        },
    });

    // Delete product mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => productAPI.delete(id),
        onSuccess: () => {
            toast.success('Product deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to delete product');
        },
    });

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            deleteMutation.mutate(id);
        }
    };

    const products = productsData?.data || [];
    const categories = categoriesData?.data || [];
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500 mt-1">Manage your furniture inventory</p>
                </div>
                <Link
                    to="/products/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat: any) => (
                            <option key={cat._id} value={cat.slug}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" />
                        <p className="text-gray-500 mt-2">Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No products found. Click "Add Product" to create one.
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-left text-sm text-gray-500">
                                <th className="p-4">Product</th>
                                <th className="p-4">SKU</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product: any) => (
                                <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                                                {product.images?.[0]?.url && (
                                                    <img
                                                        src={product.images[0].url}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-sm text-gray-500 truncate max-w-xs">
                                                    {product.shortDescription || product.description}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono text-sm">{product.sku}</td>
                                    <td className="p-4">{product.category?.name || 'N/A'}</td>
                                    <td className="p-4 font-semibold">
                                        {product.salePrice ? (
                                            <div>
                                                <span className="text-primary-600">KES {product.salePrice.toLocaleString()}</span>
                                                <span className="text-xs text-gray-400 line-through ml-2">
                                                    KES {product.price.toLocaleString()}
                                                </span>
                                            </div>
                                        ) : (
                                            <span>KES {product.price.toLocaleString()}</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className={product.stockQuantity <= product.lowStockThreshold ? 'text-red-600 font-semibold' : ''}>
                                            {product.stockQuantity}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${product.inStock
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/products/${product._id}/edit`}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                                            >
                                                <Edit className="w-4 h-4 text-gray-600" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id, product.name)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                                                disabled={deleteMutation.isPending}
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
        </div>
    );
}

