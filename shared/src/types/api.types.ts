export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: ValidationError[];
}

export interface IPaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: IPagination;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ISearchResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  query: string;
  suggestions?: string[];
}

export interface IChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  showWhatsAppButton?: boolean;
  metadata?: {
    products?: string[];
    categories?: string[];
    intent?: string;
    usedWebSearch?: boolean;
    productsCount?: number;
  };
}

export interface IChatResponse {
  message: IChatMessage;
  suggestions?: string[];
  relatedProducts?: string[];
}

