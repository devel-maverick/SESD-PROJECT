import { ProductRepository } from '../repositories/Product.repository';
import { IProduct } from '../interfaces/IProduct';

export class ProductService {
  private readonly productRepo: ProductRepository;

  constructor() {
    this.productRepo = new ProductRepository();
  }

  async getAllProducts(query?: string, category?: string): Promise<IProduct[]> {
    if (query && query.trim()) {
      return this.productRepo.searchProducts(query.trim(), category) as any;
    }
    if (category && category !== 'All') {
      return this.productRepo.findByCategory(category) as any;
    }
    return this.productRepo.findAll() as any;
  }

  async getProductById(id: string): Promise<IProduct> {
    const product = await this.productRepo.findById(id);
    if (!product) throw new Error('Product not found');
    return product as any;
  }

  async createProduct(data: Omit<IProduct, 'id'>): Promise<IProduct> {
    return this.productRepo.create(data) as any;
  }

  async updateProduct(id: string, data: Partial<IProduct>): Promise<IProduct> {
    const product = await this.productRepo.update(id, data);
    if (!product) throw new Error('Product not found');
    return product as any;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepo.delete(id);
    if (!product) throw new Error('Product not found');
  }
}
