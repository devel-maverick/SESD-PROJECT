import { Request, Response } from 'express';
import { ProductService } from '../services/Product.service';

export class ProductController {
  private readonly productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const { search, category } = req.query as { search?: string; category?: string };
      const products = await this.productService.getAllProducts(search, category);
      res.json({ success: true, count: products.length, products });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      res.json({ success: true, product });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description, price, category, stock, image } = req.body;
      if (!name || !description || !price || !category) {
        res.status(400).json({ success: false, message: 'name, description, price and category are required' });
        return;
      }
      const product = await this.productService.createProduct({ name, description, price: Number(price), category, stock: Number(stock) || 0, image: image || '' });
      res.status(201).json({ success: true, message: 'Product created', product });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.updateProduct(req.params.id, req.body);
      res.json({ success: true, message: 'Product updated', product });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.productService.deleteProduct(req.params.id);
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
