import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import { AppError } from '../middleware/error.middleware';

// @desc    Get all products with filtering, pagination, sorting
// @route   GET /api/v1/products
// @access  Public
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            page = 1,
            limit = 12,
            sort = '-createdAt',
            category,
            minPrice,
            maxPrice,
            colors,
            materials,
            inStock,
            featured,
            search,
        } = req.query;

        // Build query
        const query: any = {};

        // Category filter
        if (category) {
            const categoryDoc = await Category.findOne({ slug: category });
            if (categoryDoc) {
                // Check if this category has subcategories (is a parent category)
                const subcategories = await Category.find({ parent: categoryDoc._id });

                if (subcategories.length > 0) {
                    // If it's a parent category, include products from all subcategories
                    const categoryIds = [categoryDoc._id, ...subcategories.map(sub => sub._id)];
                    query.category = { $in: categoryIds };
                } else {
                    // If it's a leaf category, just filter by this category
                    query.category = categoryDoc._id;
                }
            }
        }

        // Price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Colors filter
        if (colors) {
            const colorArray = typeof colors === 'string' ? colors.split(',') : colors;
            query.colors = { $in: colorArray };
        }

        // Materials filter
        if (materials) {
            const materialArray = typeof materials === 'string' ? materials.split(',') : materials;
            query.materials = { $in: materialArray };
        }

        // Stock filter
        if (inStock === 'true') {
            query.inStock = true;
            query.stockQuantity = { $gt: 0 };
        }

        // Featured filter
        if (featured === 'true') {
            query.featured = true;
        }

        // On Sale filter (products with sale price)
        const onSale = req.query.onSale;
        if (onSale === 'true') {
            query.salePrice = { $exists: true, $gt: 0 };
        }

        // Search
        if (search) {
            query.$text = { $search: search as string };
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Execute query
        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort(sort as string)
            .skip(skip)
            .limit(Number(limit))
            .lean();

        // Get total count for pagination
        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            data: products,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product by ID (for admin)
// @route   GET /api/v1/products/id/:id
// @access  Private/Admin
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            'category',
            'name slug description'
        );

        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product by slug
// @route   GET /api/v1/products/:slug
// @access  Public
export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug }).populate(
            'category',
            'name slug description'
        );

        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit = 8 } = req.query;

        const products = await Product.find({ featured: true, inStock: true })
            .populate('category', 'name slug')
            .sort('-createdAt')
            .limit(Number(limit))
            .lean();

        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get related products
// @route   GET /api/v1/products/:id/related
// @access  Public
export const getRelatedProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id },
            inStock: true,
        })
            .populate('category', 'name slug')
            .limit(4)
            .lean();

        res.status(200).json({
            success: true,
            count: relatedProducts.length,
            data: relatedProducts,
        });
    } catch (error) {
        next(error);
    }
};

