import { Keyword } from '../cc-product-card/cc-product-card.types';

export interface Product {
  description: string;
  iconUrl: string;
  keywords?: Keyword[];
  name: string;
  url: string;
}

export interface ProductsCategory {
  categoryName: string;
  icon?: string;
  products: Product[];
}

export interface CategoryFilter {
  categoryName: string;
  toggled: boolean;
}
