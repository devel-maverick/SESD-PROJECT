import { Request, Response } from 'express';
import { CartService } from '../services/Cart.service';

export class CartController {
  private readonly cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  getCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const cart = await this.cartService.getCart(userId);
      res.json({ success: true, cart });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { productId, quantity = 1 } = req.body;

      if (!productId) {
        res.status(400).json({ success: false, message: 'productId is required' });
        return;
      }

      const cart = await this.cartService.addToCart(userId, productId, Number(quantity));
      res.json({ success: true, message: 'Added to cart', cart });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  removeFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { productId } = req.params;
      const cart = await this.cartService.removeFromCart(userId, productId);
      res.json({ success: true, message: 'Item removed', cart });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  updateQuantity = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { productId } = req.params;
      const { quantity } = req.body;
      const cart = await this.cartService.updateQuantity(userId, productId, Number(quantity));
      res.json({ success: true, message: 'Quantity updated', cart });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
