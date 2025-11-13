'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize from URL params
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        searchParams.get('category')?.split(',').filter(Boolean) || []
    );
    const [priceRange, setPriceRange] = useState([0, 500000]);
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>(
        searchParams.get('materials')?.split(',').filter(Boolean) || []
    );
    const [selectedColors, setSelectedColors] = useState<string[]>(
        searchParams.get('colors')?.split(',').filter(Boolean) || []
    );
    const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
    const [onSaleOnly, setOnSaleOnly] = useState(searchParams.get('onSale') === 'true');

    const categories = [
        { id: 'living-room', name: 'Living Room', count: 0 },
        { id: 'beds', name: 'Beds', count: 0 },
        { id: 'dining-sets', name: 'Dining Sets', count: 0 },
        { id: 'sofas', name: 'Sofas', count: 0 },
        { id: 'coffee-tables', name: 'Coffee Tables', count: 0 },
        { id: 'tv-stands', name: 'TV Stands', count: 0 },
        { id: 'office', name: 'Office', count: 0 },
        { id: 'outdoor', name: 'Outdoor', count: 0 },
        { id: 'storage', name: 'Storage', count: 0 },
        { id: 'hotel-restaurants', name: 'Hotel & Restaurants', count: 0 },
    ];

    const materials = ['Wood', 'Metal', 'Fabric', 'Leather', 'Glass'];
    const colors = ['Brown', 'White', 'Black', 'Gray', 'Beige', 'Blue'];

    // Apply filters to URL whenever they change
    useEffect(() => {
        applyFilters();
    }, [selectedCategories, priceRange, selectedMaterials, selectedColors, inStockOnly, onSaleOnly]);

    const applyFilters = () => {
        const params = new URLSearchParams();

        if (selectedCategories.length > 0) {
            params.set('category', selectedCategories.join(','));
        }
        if (priceRange[1] < 500000) {
            params.set('maxPrice', priceRange[1].toString());
        }
        if (selectedMaterials.length > 0) {
            params.set('materials', selectedMaterials.join(','));
        }
        if (selectedColors.length > 0) {
            params.set('colors', selectedColors.join(','));
        }
        if (inStockOnly) {
            params.set('inStock', 'true');
        }
        if (onSaleOnly) {
            params.set('onSale', 'true');
        }

        const queryString = params.toString();
        router.push(`/products${queryString ? `?${queryString}` : ''}`, { scroll: false });
    };

    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(c => c !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleMaterialToggle = (material: string) => {
        setSelectedMaterials(prev =>
            prev.includes(material)
                ? prev.filter(m => m !== material)
                : [...prev, material]
        );
    };

    const handleColorToggle = (color: string) => {
        setSelectedColors(prev =>
            prev.includes(color)
                ? prev.filter(c => c !== color)
                : [...prev, color]
        );
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setPriceRange([0, 500000]);
        setSelectedMaterials([]);
        setSelectedColors([]);
        setInStockOnly(false);
        setOnSaleOnly(false);
        router.push('/products');
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">Filters</h3>
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-primary hover:underline"
                    >
                        Clear All
                    </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                    <h4 className="font-medium mb-3">Categories</h4>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <label key={category.id} className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => handleCategoryToggle(category.id)}
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="ml-3 text-sm group-hover:text-primary transition-colors">
                                    {category.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                    <h4 className="font-medium mb-3">Price Range</h4>
                    <div className="space-y-3">
                        <input
                            type="range"
                            min="0"
                            max="500000"
                            step="10000"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            className="w-full accent-primary"
                        />
                        <div className="flex items-center justify-between text-sm">
                            <span>KES 0</span>
                            <span className="font-medium">KES {priceRange[1].toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Materials */}
                <div className="mb-6">
                    <h4 className="font-medium mb-3">Materials</h4>
                    <div className="space-y-2">
                        {materials.map((material) => (
                            <label key={material} className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedMaterials.includes(material)}
                                    onChange={() => handleMaterialToggle(material)}
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="ml-3 text-sm group-hover:text-primary transition-colors">
                                    {material}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Colors */}
                <div className="mb-6">
                    <h4 className="font-medium mb-3">Colors</h4>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => handleColorToggle(color)}
                                className={`px-3 py-1 border rounded-full text-sm transition-colors ${selectedColors.includes(color)
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-gray-300 hover:border-primary hover:text-primary'
                                    }`}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Availability */}
                <div>
                    <h4 className="font-medium mb-3">Availability</h4>
                    <div className="space-y-2">
                        <label className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={inStockOnly}
                                onChange={(e) => setInStockOnly(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="ml-3 text-sm group-hover:text-primary transition-colors">
                                In Stock Only
                            </span>
                        </label>
                        <label className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={onSaleOnly}
                                onChange={(e) => setOnSaleOnly(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="ml-3 text-sm group-hover:text-primary transition-colors">
                                On Sale
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

