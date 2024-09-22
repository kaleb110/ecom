export interface Search {
  search: string;
  category: string;
}

export interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categories: number[];
}