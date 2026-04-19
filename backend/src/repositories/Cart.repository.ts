import { Prisma } from '@prisma/client';
import { BaseRepository, prisma } from './Base.repository';

const cartInclude = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
          stock: true,
          category: true,
        },
      },
    },
  },
} satisfies Prisma.CartInclude;

type CartWithItems = Prisma.CartGetPayload<{ include: typeof cartInclude }>;

export class CartRepository extends BaseRepository<any> {
  constructor() {
    super('cart');
  }

  async findByUser(userId: string): Promise<CartWithItems | null> {
    return prisma.cart.findUnique({
      where: { userId },
      include: Object.assign({}, cartInclude),
    }) as unknown as CartWithItems | null;
  }

  async findOrCreate(userId: string): Promise<CartWithItems> {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: Object.assign({}, cartInclude),
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: Object.assign({}, cartInclude),
      });
    }

    return cart as unknown as CartWithItems;
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
  }

  async addItem(cartId: string, productId: string, quantity: number, price: number): Promise<void> {
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId, productId } },
      update: { quantity: { increment: quantity } },
      create: { cartId, productId, quantity, price },
    });
  }

  async updateItemQuantity(cartId: string, productId: string, quantity: number): Promise<void> {
    await prisma.cartItem.update({
      where: { cartId_productId: { cartId, productId } },
      data: { quantity },
    });
  }

  async removeItem(cartId: string, productId: string): Promise<void> {
    await prisma.cartItem.deleteMany({
      where: { cartId, productId },
    });
  }

  async getCartWithItems(userId: string): Promise<CartWithItems | null> {
    return prisma.cart.findUnique({
      where: { userId },
      include: Object.assign({}, cartInclude),
    }) as unknown as CartWithItems | null;
  }
}
