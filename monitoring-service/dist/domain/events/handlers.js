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
const domain_events_1 = __importDefault(require("./domain.events"));
const product_repository_1 = __importDefault(require("../../repositories/product.repository"));
const warehouse_repository_1 = __importDefault(require("../../repositories/warehouse.repository"));
domain_events_1.default.on('NewWarehouse', (_a) => __awaiter(void 0, [_a], void 0, function* ({ payload, ack }) {
    console.log('Persisting newly consumed warehouse: ', payload.correlationId);
    yield warehouse_repository_1.default.addWarehouse(payload.warehouse);
    if (ack) {
        ack();
    }
}));
domain_events_1.default.on('NewProduct', (_a) => __awaiter(void 0, [_a], void 0, function* ({ payload, ack }) {
    console.log('Persisting newly consumed product: ', payload.correlationId);
    yield product_repository_1.default.addProduct(payload.product);
    if (ack) {
        ack();
    }
}));
