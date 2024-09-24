import { Product } from "./product";

export interface ProductCategory {
  id: number;
  name: string;

  products: Product[];
}
