"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_model_1 = require("../domain/models/product/product.model");
const product_repository_1 = __importDefault(require("../repositories/product.repository"));
const AppError_1 = require("../errors/AppError");
const warehouse_repository_1 = __importDefault(require("../repositories/warehouse.repository"));
class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    createProduct(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newWarehouse = product_model_1.Product.create(Object.assign({}, data));
                yield this.productRepository.addProduct(newWarehouse);
                return { code: 201, result: newWarehouse };
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    return { code: error.statusCode, result: error.message };
                }
                throw new Error('Failed to create product');
            }
        });
    }
    processPurchase(body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId, quantity } = body;
            const product = yield product_repository_1.default.get(productId);
            if (product) {
                if (quantity > product.quantity) {
                    throw new AppError_1.AppError(400, 'invalid quantity');
                }
                const updated = yield product_repository_1.default.updateQuantity(productId, quantity);
                if (updated) {
                    product.quantity -= quantity;
                    const warehouse = (yield warehouse_repository_1.default.getWarehouseById(product.warehouseId));
                    product.handlePurchase(res, warehouse.address);
                }
                return true;
            }
            throw new AppError_1.AppError(404, 'Product not found');
        });
    }
}
exports.ProductService = ProductService;
const productService = new ProductService(product_repository_1.default);
exports.default = productService;
