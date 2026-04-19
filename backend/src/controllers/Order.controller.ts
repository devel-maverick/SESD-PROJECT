import { Request, Response } from 'express';
import { OrderService } from '../services/Order.service';

export class OrderController {
  private readonly orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const result = await this.orderService.createRazorpayOrder(userId);
      res.status(201).json({ success: true, ...result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        res.status(400).json({ success: false, message: 'Missing payment details' });
        return;
      }

      const order = await this.orderService.confirmPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );
      res.json({ success: true, message: 'Payment verified & order confirmed', order });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getMyOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const orders = await this.orderService.getUserOrders(userId);
      res.json({ success: true, count: orders.length, orders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const orders = await this.orderService.getAllOrders();
      res.json({ success: true, count: orders.length, orders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
