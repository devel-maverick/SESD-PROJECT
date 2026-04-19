import { Request, Response } from 'express';
import { OrderService } from '../services/Order.service';

export class OrderController {
  private readonly orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  placeOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const order = await this.orderService.placeOrder(userId);
      res.status(201).json({ success: true, message: 'Order placed successfully', order });
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
