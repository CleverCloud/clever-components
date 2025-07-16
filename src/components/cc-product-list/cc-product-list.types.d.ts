export interface Product {
  description: string;
  iconUrl: string;
  productStatus?: string;
  searchTerms?: string[];
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
