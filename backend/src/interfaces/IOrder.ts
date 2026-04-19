export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface IOrderItem {
  id?: string;
  productId: string;
  product?: any;
  quantity: number;
  price: number;
  name?: string;
}

export interface IOrder {
  id?: string;
  userId: string;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  razorpayOrderId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
