export interface ICartItem {
  id?: string;
  productId: string;
  product?: any;
  quantity: number;
  price: number;
}

export interface ICart {
  id?: string;
  userId: string;
  items: ICartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}
