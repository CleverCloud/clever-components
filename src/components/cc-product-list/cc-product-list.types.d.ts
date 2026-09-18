export interface Product {
  description: string;
  iconUrl: string;
  productStatus?: string;
  searchTerms?: string[];
  name: string;
  url: string;
}

export interface ProductsCategory {
  /**
   * A stable key used to filter the category. Never displayed. Defaults to `categoryName`.
   * The key must not be `all`: this value means all categories, so such a category could never be selected.
   */
  id?: string;
  categoryName: string;
  icon?: string;
  products: Product[];
}

export interface CategoryFilter {
  id?: string;
  categoryName: string;
  toggled: boolean;
}
