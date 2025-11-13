import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Plus, X, Upload } from 'lucide-react';
import { productAPI, categoryAPI, uploadAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ProductForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const queryClient = useQueryClient();
    const isEditMode = !!id;

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        description: '',
        shortDescription: '',
        price: '',
        salePrice: '',
        stockQuantity: '',
        lowStockThreshold: '5',
        category: '',
        subcategory: '',
        featured: false,
        inStock: true,
        // Dimensions
        length: '',
        width: '',
        height: '',
        weight: '',
        dimensionUnit: 'cm',
        weightUnit: 'kg',
        // Arrays
        materials: [''],
        colors: [''],
        tags: [''],
        images: [{ url: '', alt: '', isPrimary: true }],
    });

    // Store selected files before upload
    const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File }>({});
    const [previewUrls, setPreviewUrls] = useState<{ [key: number]: string }>({});

    // Fetch categories
    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await categoryAPI.getAll();
            return response.data;
        },
    });

    // Fetch product data if editing
    const { data: productData, isLoading: isLoadingProduct, isError: isProductError } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            if (!id) return null;
            const response = await productAPI.getById(id);
            return response.data;
        },
        enabled: isEditMode,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    // Populate form when product data is loaded
    useEffect(() => {
        if (productData?.data) {
            const product = productData.data;
            console.log('Loaded product data:', product); // Debug log

            setFormData({
                name: product.name || '',
                sku: product.sku || '',
                description: product.description || '',
                shortDescription: product.shortDescription || '',
                price: product.price?.toString() || '',
                salePrice: product.salePrice?.toString() || '',
                stockQuantity: product.stockQuantity?.toString() || '',
                lowStockThreshold: product.lowStockThreshold?.toString() || '5',
                category: product.category?._id || product.category || '',
                subcategory: product.subcategory || '',
                featured: product.featured || false,
                inStock: product.inStock !== undefined ? product.inStock : true,
                // Dimensions
                length: product.dimensions?.length?.toString() || '',
                width: product.dimensions?.width?.toString() || '',
                height: product.dimensions?.height?.toString() || '',
                weight: product.dimensions?.weight?.toString() || '',
                dimensionUnit: product.dimensions?.unit || 'cm',
                weightUnit: product.dimensions?.weightUnit || 'kg',
                // Arrays
                materials: product.materials?.length > 0 ? product.materials : [''],
                colors: product.colors?.length > 0 ? product.colors : [''],
                tags: product.tags?.length > 0 ? product.tags : [''],
                images: product.images?.length > 0 ? product.images.map((img: any) => ({
                    url: img.url || '',
                    alt: img.alt || '',
                    isPrimary: img.isPrimary || false,
                })) : [{ url: '', alt: '', isPrimary: true }],
            });
        }
    }, [productData]);

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data: any) => productAPI.create(data),
        onSuccess: () => {
            toast.success('Product created successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            navigate('/products');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to create product');
        },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (data: any) => productAPI.update(id!, data),
        onSuccess: () => {
            toast.success('Product updated successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['product', id] });
            navigate('/products');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to update product');
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Check if there are any images (either URLs or selected files)
            const hasImages = formData.images.some(img => img.url) || Object.keys(selectedFiles).length > 0;
            if (!hasImages) {
                toast.error('Please upload at least one product image');
                return;
            }

            // Show uploading toast
            const uploadToast = Object.keys(selectedFiles).length > 0
                ? toast.loading(`Uploading ${Object.keys(selectedFiles).length} image(s) to ImageKit...`)
                : null;

            // Upload all new images to ImageKit
            const updatedImages = [...formData.images];
            for (const [indexStr, file] of Object.entries(selectedFiles)) {
                const index = parseInt(indexStr);
                try {
                    const response = await uploadAPI.uploadImage(file, 'products');
                    const imageUrl = response.data.data.url;

                    updatedImages[index] = {
                        ...updatedImages[index],
                        url: imageUrl,
                    };
                } catch (error: any) {
                    if (uploadToast) toast.dismiss(uploadToast);
                    toast.error(`Failed to upload image: ${file.name}`);
                    return;
                }
            }

            if (uploadToast) {
                toast.dismiss(uploadToast);
                toast.success('Images uploaded successfully!');
            }

            // Filter valid images
            const validImages = updatedImages.filter(img => img.url.trim() !== '');

            if (validImages.length === 0) {
                toast.error('Please upload at least one product image');
                return;
            }

            // Prepare product data
            const data = {
                name: formData.name,
                sku: formData.sku,
                description: formData.description,
                shortDescription: formData.shortDescription,
                price: parseFloat(formData.price),
                salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
                stockQuantity: parseInt(formData.stockQuantity),
                lowStockThreshold: parseInt(formData.lowStockThreshold),
                category: formData.category,
                subcategory: formData.subcategory || undefined,
                featured: formData.featured,
                inStock: formData.inStock,
                dimensions: {
                    length: parseFloat(formData.length),
                    width: parseFloat(formData.width),
                    height: parseFloat(formData.height),
                    weight: parseFloat(formData.weight),
                    unit: formData.dimensionUnit,
                    weightUnit: formData.weightUnit,
                },
                materials: formData.materials.filter(m => m.trim() !== ''),
                colors: formData.colors.filter(c => c.trim() !== ''),
                tags: formData.tags.filter(t => t.trim() !== ''),
                images: validImages,
            };

            // Submit product
            if (isEditMode) {
                updateMutation.mutate(data);
            } else {
                createMutation.mutate(data);
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred while saving the product');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Array field handlers
    const handleArrayChange = (field: 'materials' | 'colors' | 'tags', index: number, value: string) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayField = (field: 'materials' | 'colors' | 'tags') => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const removeArrayField = (field: 'materials' | 'colors' | 'tags', index: number) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: newArray.length > 0 ? newArray : [''] });
    };

    // Image handlers
    const addImage = () => {
        setFormData({
            ...formData,
            images: [...formData.images, { url: '', alt: '', isPrimary: false }]
        });
    };

    const removeImage = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages.length > 0 ? newImages : [{ url: '', alt: '', isPrimary: true }] });
    };

    const setPrimaryImage = (index: number) => {
        const newImages = formData.images.map((img, i) => ({
            ...img,
            isPrimary: i === index,
        }));
        setFormData({ ...formData, images: newImages });
    };

    // Handle file selection (create preview, don't upload yet)
    const handleImageSelect = (index: number, file: File) => {
        // Store the file
        setSelectedFiles(prev => ({ ...prev, [index]: file }));

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setPreviewUrls(prev => ({ ...prev, [index]: previewUrl }));

        // Update alt text with filename
        const newImages = [...formData.images];
        newImages[index] = {
            ...newImages[index],
            alt: newImages[index].alt || file.name.replace(/\.[^/.]+$/, ''),
        };
        setFormData({ ...formData, images: newImages });
    };

    // Cleanup preview URLs on unmount
    useEffect(() => {
        return () => {
            Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const isSubmitting = createMutation.isPending || updateMutation.isPending;
    const categories = categoriesData?.data || [];

    if (isEditMode && isLoadingProduct) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                <p className="ml-2 text-gray-600">Loading product...</p>
            </div>
        );
    }

    if (isEditMode && isProductError) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        The product you're trying to edit doesn't exist or may have been deleted.
                    </p>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
                    >
                        ← Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/products')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Product' : 'Add New Product'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {isEditMode ? 'Update product details' : 'Fill in the product details'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 space-y-4">
                            <h3 className="text-lg font-semibold">Basic Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Modern Sofa Set"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        SKU *
                                    </label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="SOF-1001"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Short Description
                                </label>
                                <input
                                    type="text"
                                    name="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Brief description for product listings"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Detailed product description..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat: any) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subcategory
                                    </label>
                                    <input
                                        type="text"
                                        name="subcategory"
                                        value={formData.subcategory}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="e.g., Living Room, Bedroom"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Inventory */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 space-y-4">
                            <h3 className="text-lg font-semibold">Pricing & Inventory</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price (KES) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="45000"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sale Price
                                    </label>
                                    <input
                                        type="number"
                                        name="salePrice"
                                        value={formData.salePrice}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="39000"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Stock Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        name="stockQuantity"
                                        value={formData.stockQuantity}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="50"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Low Stock Threshold
                                    </label>
                                    <input
                                        type="number"
                                        name="lowStockThreshold"
                                        value={formData.lowStockThreshold}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="5"
                                        min="0"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="inStock"
                                            checked={formData.inStock}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">In Stock</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Featured</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Dimensions */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 space-y-4">
                            <h3 className="text-lg font-semibold">Dimensions *</h3>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Length *
                                    </label>
                                    <input
                                        type="number"
                                        name="length"
                                        value={formData.length}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="200"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Width *
                                    </label>
                                    <input
                                        type="number"
                                        name="width"
                                        value={formData.width}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="90"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Height *
                                    </label>
                                    <input
                                        type="number"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="80"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Unit
                                    </label>
                                    <select
                                        name="dimensionUnit"
                                        value={formData.dimensionUnit}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="cm">cm</option>
                                        <option value="inch">inch</option>
                                    </select>
                                </div>

                                <div className="md:col-span-1"></div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Weight *
                                    </label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="25"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Weight Unit
                                    </label>
                                    <select
                                        name="weightUnit"
                                        value={formData.weightUnit}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="kg">kg</option>
                                        <option value="lb">lb</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">Product Images *</h3>
                                    <p className="text-xs text-gray-500 mt-1">Upload multiple images. Mark one as primary for main display.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addImage}
                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Image
                                </button>
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                                <p className="font-medium mb-1">📸 Multiple Images Guide:</p>
                                <ul className="text-xs space-y-1 ml-4 list-disc">
                                    <li><strong>Primary Image:</strong> Shown first on product page (blue border in preview)</li>
                                    <li><strong>Additional Images:</strong> Shown in gallery below primary image</li>
                                    <li><strong>Add More:</strong> Click "Add Image" button to upload additional images</li>
                                    <li><strong>Remove:</strong> Click X button to remove unwanted images</li>
                                </ul>
                            </div>

                            {formData.images.map((image, index) => {
                                const hasPreview = previewUrls[index] || image.url;
                                const previewSrc = previewUrls[index] || image.url;

                                return (
                                    <div key={index} className="flex gap-3 items-start p-4 border border-gray-200 rounded-lg">
                                        {/* Image Preview */}
                                        {hasPreview && (
                                            <div className="flex-shrink-0 w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                                                <img
                                                    src={previewSrc}
                                                    alt={image.alt || 'Product preview'}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Invalid+Image';
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className="flex-1 space-y-3">
                                            {/* Upload Button */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {hasPreview ? 'Change Image' : 'Upload Image *'}
                                                </label>
                                                <div className="flex gap-2">
                                                    <label className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition cursor-pointer">
                                                        <Upload className="w-4 h-4" />
                                                        Choose Image
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    handleImageSelect(index, file);
                                                                }
                                                            }}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                </div>
                                                {hasPreview && (
                                                    <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                                        {previewUrls[index] ? (
                                                            <>
                                                                <span>📎</span> Ready to upload when you save
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>✓</span> Existing image
                                                            </>
                                                        )}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Primary Image */}
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    checked={image.isPrimary}
                                                    onChange={() => setPrimaryImage(index)}
                                                    className="w-4 h-4 text-primary-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700">Primary Image</span>
                                            </label>
                                        </div>

                                        {/* Remove Button */}
                                        {formData.images.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {/* Materials, Colors, Tags */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 space-y-4">
                            <h3 className="text-lg font-semibold">Additional Details</h3>

                            {/* Materials */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Materials</label>
                                    <button
                                        type="button"
                                        onClick={() => addArrayField('materials')}
                                        className="text-sm text-primary-500 hover:text-primary-600"
                                    >
                                        + Add Material
                                    </button>
                                </div>
                                {formData.materials.map((material, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={material}
                                            onChange={(e) => handleArrayChange('materials', index, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="e.g., Solid Wood, Fabric"
                                        />
                                        {formData.materials.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeArrayField('materials', index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Colors */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Colors</label>
                                    <button
                                        type="button"
                                        onClick={() => addArrayField('colors')}
                                        className="text-sm text-primary-500 hover:text-primary-600"
                                    >
                                        + Add Color
                                    </button>
                                </div>
                                {formData.colors.map((color, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={color}
                                            onChange={(e) => handleArrayChange('colors', index, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="e.g., Brown, Beige"
                                        />
                                        {formData.colors.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeArrayField('colors', index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Tags */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                                    <button
                                        type="button"
                                        onClick={() => addArrayField('tags')}
                                        className="text-sm text-primary-500 hover:text-primary-600"
                                    >
                                        + Add Tag
                                    </button>
                                </div>
                                {formData.tags.map((tag, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={tag}
                                            onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="e.g., modern, bestseller"
                                        />
                                        {formData.tags.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeArrayField('tags', index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/products')}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Product' : 'Create Product')}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Live Preview Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-4">
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                                {(() => {
                                    const imageCount = formData.images.filter((img, idx) => previewUrls[idx] || img.url).length;
                                    return imageCount > 0 && (
                                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                                            {imageCount} {imageCount === 1 ? 'image' : 'images'}
                                        </span>
                                    );
                                })()}
                            </div>

                            {/* Show helper text if form is mostly empty */}
                            {!formData.name && !formData.price && formData.images.filter(img => img.url).length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    <p className="text-sm">Start filling the form to see a live preview</p>
                                </div>
                            ) : (
                                <>
                                    {/* Image Gallery Preview */}
                                    <div className="space-y-3 mb-4">
                                        {formData.images.some((img, idx) => previewUrls[idx] || img.url) ? (
                                            <>
                                                {/* Primary Image */}
                                                {(() => {
                                                    const primaryIndex = formData.images.findIndex(img => img.isPrimary);
                                                    const primarySrc = previewUrls[primaryIndex] || formData.images[primaryIndex]?.url;
                                                    return primarySrc && (
                                                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-primary-500 bg-gray-50">
                                                            <img
                                                                src={primarySrc}
                                                                alt="Primary preview"
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Invalid+Image';
                                                                }}
                                                            />
                                                        </div>
                                                    );
                                                })()}

                                                {/* Thumbnail Gallery */}
                                                {formData.images.filter((img, idx) => previewUrls[idx] || img.url).length > 1 && (
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {formData.images.map((image, index) => {
                                                            const imgSrc = previewUrls[index] || image.url;
                                                            return imgSrc ? (
                                                                <div
                                                                    key={index}
                                                                    className={`aspect-square rounded-lg overflow-hidden border ${image.isPrimary ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'
                                                                        } bg-gray-50`}
                                                                >
                                                                    <img
                                                                        src={imgSrc}
                                                                        alt={`Thumbnail ${index + 1}`}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=Error';
                                                                        }}
                                                                    />
                                                                </div>
                                                            ) : null;
                                                        })}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                                                <div className="text-center text-gray-400">
                                                    <Upload className="w-8 h-8 mx-auto mb-2" />
                                                    <p className="text-sm">Upload images to preview</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="space-y-3 pt-4 border-t border-gray-200">
                                        {/* Name & SKU */}
                                        {(formData.name || formData.sku) && (
                                            <div>
                                                {formData.name && (
                                                    <h4 className="text-xl font-bold text-gray-900">
                                                        {formData.name}
                                                    </h4>
                                                )}
                                                {formData.sku && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        SKU: {formData.sku}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Price */}
                                        {formData.price && (
                                            <div className="flex items-baseline gap-2">
                                                {formData.salePrice ? (
                                                    <>
                                                        <span className="text-2xl font-bold text-primary-600">
                                                            KES {parseFloat(formData.salePrice).toLocaleString()}
                                                        </span>
                                                        <span className="text-lg text-gray-400 line-through">
                                                            KES {parseFloat(formData.price).toLocaleString()}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-2xl font-bold text-gray-900">
                                                        KES {parseFloat(formData.price).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Description */}
                                        {formData.description && (
                                            <div>
                                                <p className="text-sm text-gray-600 line-clamp-3">
                                                    {formData.description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Short Description */}
                                        {formData.shortDescription && !formData.description && (
                                            <p className="text-sm text-gray-600">
                                                {formData.shortDescription}
                                            </p>
                                        )}

                                        {/* Stock Status */}
                                        {(formData.stockQuantity || formData.inStock !== undefined || formData.featured) && (
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${formData.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {formData.inStock ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                                {formData.featured && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Stock Quantity */}
                                        {formData.stockQuantity && (
                                            <p className="text-sm text-gray-600">
                                                Stock: <span className="font-medium">{formData.stockQuantity} units</span>
                                            </p>
                                        )}

                                        {/* Dimensions */}
                                        {(formData.length || formData.width || formData.height) && (
                                            <div className="pt-3 border-t border-gray-200">
                                                <p className="text-sm font-medium text-gray-700 mb-1">Dimensions</p>
                                                <p className="text-sm text-gray-600">
                                                    {formData.length || '?'}L × {formData.width || '?'}W × {formData.height || '?'}H {formData.dimensionUnit}
                                                </p>
                                                {formData.weight && (
                                                    <p className="text-sm text-gray-600">
                                                        Weight: {formData.weight} {formData.weightUnit}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Materials */}
                                        {formData.materials.filter(m => m.trim()).length > 0 && (
                                            <div className="pt-3 border-t border-gray-200">
                                                <p className="text-sm font-medium text-gray-700 mb-1">Materials</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {formData.materials.filter(m => m.trim()).map((material, index) => (
                                                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                                                            {material}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Colors */}
                                        {formData.colors.filter(c => c.trim()).length > 0 && (
                                            <div className="pt-3 border-t border-gray-200">
                                                <p className="text-sm font-medium text-gray-700 mb-1">Colors</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {formData.colors.filter(c => c.trim()).map((color, index) => (
                                                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                                                            {color}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Category */}
                                        {formData.category && (
                                            <div className="pt-3 border-t border-gray-200">
                                                <p className="text-sm text-gray-600">
                                                    Category: <span className="font-medium">
                                                        {categories.find((c: any) => c._id === formData.category)?.name || 'Unknown'}
                                                    </span>
                                                </p>
                                                {formData.subcategory && (
                                                    <p className="text-sm text-gray-600">
                                                        Subcategory: <span className="font-medium">{formData.subcategory}</span>
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
