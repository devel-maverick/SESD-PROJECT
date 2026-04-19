import { CartRepository } from '../repositories/Cart.repository';
import { ProductRepository } from '../repositories/Product.repository';
import { ICart } from '../interfaces/ICart';

export class CartService {
  private readonly cartRepo: CartRepository;
  private readonly productRepo: ProductRepository;

  constructor() {
    this.cartRepo = new CartRepository();
    this.productRepo = new ProductRepository();
  }

  async getCart(userId: string): Promise<ICart> {
    return this.cartRepo.findOrCreate(userId) as unknown as ICart;
  }

  async addToCart(userId: string, productId: string, quantity: number): Promise<ICart> {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new Error('Product not found');
    if (product.stock < quantity) throw new Error(`Only ${product.stock} items in stock`);

    const cart: any = await this.cartRepo.findOrCreate(userId);

    const existingItem = cart.items.find(
      (item: any) => item.productId === productId
    );

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (product.stock < newQty) throw new Error(`Only ${product.stock} items in stock`);
      await this.cartRepo.updateItemQuantity(cart.id, productId, newQty);
    } else {
      await this.cartRepo.addItem(cart.id, productId, quantity, product.price);
    }

    return this.cartRepo.getCartWithItems(userId) as unknown as ICart;
  }

  async removeFromCart(userId: string, productId: string): Promise<ICart> {
    const cart: any = await this.cartRepo.findByUser(userId);
    if (!cart) throw new Error('Cart not found');

    await this.cartRepo.removeItem(cart.id, productId);

    return this.cartRepo.getCartWithItems(userId) as unknown as ICart;
  }

  async updateQuantity(userId: string, productId: string, quantity: number): Promise<ICart> {
    if (quantity <= 0) return this.removeFromCart(userId, productId);

    const product = await this.productRepo.findById(productId);
    if (!product) throw new Error('Product not found');
    if (product.stock < quantity) throw new Error(`Only ${product.stock} items in stock`);

    const cart: any = await this.cartRepo.findByUser(userId);
    if (!cart) throw new Error('Cart not found');

    const item = cart.items.find((i: any) => i.productId === productId);
    if (!item) throw new Error('Item not in cart');

    await this.cartRepo.updateItemQuantity(cart.id, productId, quantity);

    return this.cartRepo.getCartWithItems(userId) as unknown as ICart;
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartRepo.clearCart(userId);
  }
}
