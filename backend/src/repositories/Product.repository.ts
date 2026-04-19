import { Product } from '@prisma/client';
import { BaseRepository, prisma } from './Base.repository';

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super('product');
  }

  async searchProducts(query: string, category?: string): Promise<Product[]> {
    const where: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    };
    if (category && category !== 'All') {
      where.category = category;
    }
    return prisma.product.findMany({ where });
  }

  async findByCategory(category: string): Promise<Product[]> {
    if (category === 'All') return this.findAll();
    return this.findAll({ category });
  }

  async updateStock(id: string, quantity: number): Promise<Product | null> {
    return prisma.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });
  }
}
