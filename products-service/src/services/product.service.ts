import { IProduct, INewProduct } from '../interface/product.interface';
import { Product } from '../domain/models/product/product.model';
import productsRepo, {
  ProductRepository,
} from '../repositories/product.repository';
import { AppError } from '../errors/AppError';
import { UUID } from 'crypto';
import { Response } from 'express';
import warehouseRepo from '../repositories/warehouse.repository';
import { Warehouse } from '../domain/models/warehouse/warehouse.model';

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  public async createProduct(
    data: INewProduct
  ): Promise<{ code: number; result: IProduct | null | string }> {
    try {
      const newWarehouse = Product.create({ ...data });
      await this.productRepository.addProduct(newWarehouse);
      return { code: 201, result: newWarehouse };
    } catch (error) {
      if (error instanceof AppError) {
        return { code: error.statusCode, result: error.message };
      }
      throw new Error('Failed to create product');
    }
  }

  public async processPurchase(
    body: { productId: UUID; quantity: number },
    res: Response
  ) {
    const { productId, quantity } = body;
    const product = await productsRepo.get(productId);

    if (product) {
      if (quantity > product.quantity) {
        throw new AppError(400, 'invalid quantity');
      }
      const updated = await productsRepo.updateQuantity(productId, quantity);
      if (updated) {
        product.quantity -= quantity;
        const warehouse = (await warehouseRepo.getWarehouseById(
          product.warehouseId as UUID
        )) as Warehouse;

        product.handlePurchase(res, warehouse.address);
      }

      return true;
    }
    throw new AppError(404, 'Product not found');
  }
}

const productService = new ProductService(productsRepo);

export default productService;
