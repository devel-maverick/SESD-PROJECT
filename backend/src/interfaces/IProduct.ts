export type Category = 'Electronics' | 'Grocery' | 'Fashion' | 'Shoes' | 'Furniture' | 'Books';

export interface IProduct {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  stock: number;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}
