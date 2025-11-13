export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  sku: string;
  category: string | ICategory;
  subcategory?: string;
  images: IProductImage[];
  model3D?: I3DModel;
  variants?: IProductVariant[];
  specifications: ISpecification[];
  dimensions: IDimensions;
  materials: string[];
  colors: string[];
  inStock: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  featured: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
  thumbnail?: string;
  medium?: string;
  large?: string;
}

export interface I3DModel {
  glbUrl: string;      // For web/Android
  usdzUrl?: string;    // For iOS AR
  thumbnailUrl?: string;
  size: number;        // File size in bytes
}

export interface IProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'material' | 'finish';
  value: string;
  priceModifier: number;
  images?: string[];
  sku: string;
  inStock: boolean;
}

export interface ISpecification {
  label: string;
  value: string;
}

export interface IDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
  unit: 'cm' | 'inch';
  weightUnit: 'kg' | 'lb';
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string | ICategory;
  order: number;
  isActive: boolean;
}

export interface IProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  materials?: string[];
  inStock?: boolean;
  featured?: boolean;
  search?: string;
  sort?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

