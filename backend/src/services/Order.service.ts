import crypto from 'crypto';
import { OrderRepository } from '../repositories/Order.repository';
import { CartRepository } from '../repositories/Cart.repository';
import { CartService } from './Cart.service';
import { IOrder } from '../interfaces/IOrder';

export class OrderService {
  private readonly orderRepo: OrderRepository;
  private readonly cartRepo: CartRepository;
  private readonly cartService: CartService;

  constructor() {
    this.orderRepo = new OrderRepository();
    this.cartRepo = new CartRepository();
    this.cartService = new CartService();
  }

  async placeOrder(userId: string): Promise<IOrder> {
    const cart: any = await this.cartRepo.findByUser(userId);
    if (!cart || cart.items.length === 0) throw new Error('Cart is empty');

    const totalAmount = cart.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const orderItems = cart.items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      name: item.product?.name || '',
    }));

    const order = await this.orderRepo.createWithItems({
      userId,
      items: orderItems,
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'paid',
      razorpayOrderId: `COD-${crypto.randomBytes(6).toString('hex').toUpperCase()}`,
    });

    await this.cartService.clearCart(userId);

    return order as unknown as IOrder;
  }

  async getUserOrders(userId: string): Promise<IOrder[]> {
    return this.orderRepo.findByUser(userId) as unknown as IOrder[];
  }

  async getAllOrders(): Promise<IOrder[]> {
    return this.orderRepo.findAll() as unknown as IOrder[];
  }
}
