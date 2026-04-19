import Razorpay from 'razorpay';
import crypto from 'crypto';
import { OrderRepository } from '../repositories/Order.repository';
import { CartRepository } from '../repositories/Cart.repository';
import { CartService } from './Cart.service';
import { IOrder } from '../interfaces/IOrder';

export class OrderService {
  private readonly orderRepo: OrderRepository;
  private readonly cartRepo: CartRepository;
  private readonly cartService: CartService;
  private readonly razorpay: Razorpay;

  constructor() {
    this.orderRepo = new OrderRepository();
    this.cartRepo = new CartRepository();
    this.cartService = new CartService();
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });
  }

  async createRazorpayOrder(userId: string): Promise<{
    order: IOrder;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    key: string;
  }> {
    const cart: any = await this.cartRepo.findByUser(userId);
    if (!cart || cart.items.length === 0) throw new Error('Cart is empty');

    const totalAmount = cart.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const razorpayOrder = await this.razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `qc_${Date.now()}`,
    });

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
      status: 'pending',
      paymentStatus: 'pending',
      razorpayOrderId: razorpayOrder.id,
    });

    return {
      order: order as unknown as IOrder,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount as number,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID || '',
    };
  }

  verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');
    return expectedSignature === razorpaySignature;
  }

  async confirmPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<IOrder> {
    const isValid = this.verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );
    if (!isValid) throw new Error('Invalid payment signature');

    const order = await this.orderRepo.findByRazorpayOrderId(razorpayOrderId);
    if (!order) throw new Error('Order not found');

    const updated = await this.orderRepo.updatePaymentStatus(
      order.id,
      razorpayPaymentId,
      'paid',
      'confirmed'
    );

    await this.cartService.clearCart(order.userId.toString());

    return updated as unknown as IOrder;
  }

  async getUserOrders(userId: string): Promise<IOrder[]> {
    return this.orderRepo.findByUser(userId) as unknown as IOrder[];
  }

  async getAllOrders(): Promise<IOrder[]> {
    return this.orderRepo.findAll() as unknown as IOrder[];
  }
}
