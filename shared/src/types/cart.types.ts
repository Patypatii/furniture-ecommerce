export interface ICart {
  _id: string;
  user?: string;
  sessionId?: string;
  items: ICartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartItem {
  product: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  variant?: {
    id: string;
    name: string;
    value: string;
  };
  subtotal: number;
}

export interface IAddToCartData {
  productId: string;
  quantity: number;
  variantId?: string;
}

export interface IUpdateCartItemData {
  productId: string;
  quantity: number;
}

