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
const rabbitmq_client_1 = __importDefault(require("../../infrastructure/broker/rabbitmq.client"));
const warehouse_repository_1 = __importDefault(require("../../repositories/warehouse.repository"));
domain_events_1.default.on('NewWarehouse', (payload) => {
    const msgOpts = {
        type: payload.eventType,
        contentType: 'application/json',
        deliveryMode: 2,
        timestamp: payload.created,
        correlationId: payload.correlationId,
    };
    rabbitmq_client_1.default.publish('warehouses.exchange', 'warehouse', Buffer.from(JSON.stringify(payload.warehouse.plain())), msgOpts);
});
domain_events_1.default.on('NewProduct', (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { warehouseId, quantity } = payload.product;
    yield warehouse_repository_1.default.updateLoad(warehouseId, quantity);
}));
