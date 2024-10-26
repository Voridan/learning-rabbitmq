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
exports.RabbitMQClient = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const queues_1 = require("./queues");
const domain_events_1 = __importDefault(require("../../domain/events/domain.events"));
const new_warehouse_1 = require("../../domain/models/warehouse/new.warehouse");
const warehouse_model_1 = require("../../domain/models/warehouse/warehouse.model");
const new_product_1 = require("../../domain/models/product/new.product");
const product_model_1 = require("../../domain/models/product/product.model");
class RabbitMQClient {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.warehouseChannel = null;
        this.productChannel = null;
        this.ordersChannel = null;
        this.transportChannel = null;
        this.postChannel = null;
    }
    connect(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.connection = yield amqplib_1.default.connect(url);
                this.warehouseChannel = yield this.connection.createChannel();
                this.productChannel = yield this.connection.createChannel();
                console.log('Connected to RabbitMQ...');
                yield this.config();
                console.log('Configured...');
            }
            catch (error) {
                console.error('Error connecting to RabbitMQ:', error);
                throw error;
            }
        });
    }
    config() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.all([this.consumeWarehouses(), this.consumeProducts()]);
            }
            catch (error) {
                console.log('From Rabbitmq Client...  ', error);
            }
        });
    }
    consumeWarehouses() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.warehouseChannel) {
                const { name, exchange, key } = queues_1.newWarehouseQueue;
                yield this.warehouseChannel.assertQueue(name, {
                    durable: true,
                });
                yield this.warehouseChannel.bindQueue(name, exchange, key),
                    yield this.warehouseChannel.consume(name, (msg) => {
                        if (msg) {
                            console.log('Consumed new warehouse: %s', msg === null || msg === void 0 ? void 0 : msg.content.toString());
                            const payload = JSON.parse(msg.content.toString());
                            domain_events_1.default.emit('NewWarehouse', {
                                payload: new new_warehouse_1.NewWarehouse(warehouse_model_1.Warehouse.map(payload)),
                                ack: () => { var _a; return (_a = this.warehouseChannel) === null || _a === void 0 ? void 0 : _a.ack(msg); },
                            });
                        }
                    }, {
                        noAck: false,
                    });
            }
        });
    }
    consumeProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.productChannel) {
                const { name, exchange, key } = queues_1.newProductQueue;
                yield this.productChannel.assertQueue(name, { durable: true });
                yield this.productChannel.bindQueue(name, exchange, key);
                this.productChannel.consume(name, (msg) => {
                    if (msg) {
                        console.log('Consumed new product: %s', msg === null || msg === void 0 ? void 0 : msg.content.toString());
                        const payload = JSON.parse(msg.content.toString());
                        domain_events_1.default.emit('NewProduct', {
                            payload: new new_product_1.NewProduct(product_model_1.Product.map(payload)),
                            ack: () => { var _a; return (_a = this.productChannel) === null || _a === void 0 ? void 0 : _a.ack(msg); },
                        });
                    }
                }, { noAck: false });
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                yield ((_a = this.channel) === null || _a === void 0 ? void 0 : _a.close());
                yield ((_b = this.warehouseChannel) === null || _b === void 0 ? void 0 : _b.close());
                yield ((_c = this.postChannel) === null || _c === void 0 ? void 0 : _c.close());
                yield ((_d = this.productChannel) === null || _d === void 0 ? void 0 : _d.close());
                yield ((_e = this.ordersChannel) === null || _e === void 0 ? void 0 : _e.close());
                yield ((_f = this.transportChannel) === null || _f === void 0 ? void 0 : _f.close());
                console.log('RabbitMQ connection closed');
            }
            catch (error) {
                console.error('Error closing RabbitMQ connection:', error);
                throw error;
            }
        });
    }
}
exports.RabbitMQClient = RabbitMQClient;
const rabbitmq = new RabbitMQClient();
exports.default = rabbitmq;
