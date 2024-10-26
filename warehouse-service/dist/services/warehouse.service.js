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
exports.WarehouseService = void 0;
const warehouse_repository_1 = __importDefault(require("../repositories/warehouse.repository"));
const warehouse_model_1 = require("../domain/models/warehouse.model");
class WarehouseService {
    constructor(warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }
    createWarehouse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newWarehouse = warehouse_model_1.Warehouse.create(Object.assign({}, data));
            yield this.warehouseRepository.addWarehouse(newWarehouse);
            return newWarehouse;
        });
    }
}
exports.WarehouseService = WarehouseService;
const warehouseService = new WarehouseService(warehouse_repository_1.default);
exports.default = warehouseService;
