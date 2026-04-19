import { Order } from '@prisma/client';
import { BaseRepository, prisma } from './Base.repository';

const ORDER_INCLUDE = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          image: true,
          category: true,
        },
      },
    },
  },
} as const;

export class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super('order');
  }

  async findByUser(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: ORDER_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByRazorpayOrderId(razorpayOrderId: string) {
    return prisma.order.findFirst({ where: { razorpayOrderId } });
  }

  async createWithItems(data: {
    userId: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    razorpayOrderId: string;
    items: { productId: string; quantity: number; price: number; name: string }[];
  }) {
    return prisma.order.create({
      data: {
        userId: data.userId,
        totalAmount: data.totalAmount,
        status: data.status as any,
        paymentStatus: data.paymentStatus as any,
        razorpayOrderId: data.razorpayOrderId,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
          })),
        },
      },
      include: ORDER_INCLUDE,
    });
  }

  async updatePaymentStatus(
    orderId: string,
    paymentId: string,
    paymentStatus: string,
    status: string
  ) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        paymentId,
        paymentStatus: paymentStatus as any,
        status: status as any,
      },
      include: ORDER_INCLUDE,
    });
  }
}
