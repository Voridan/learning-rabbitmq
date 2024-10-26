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
const warehouse_model_1 = require("../../domain/models/warehouse/warehouse.model");
const new_warehouse_1 = require("../../domain/models/warehouse/new.warehouse");
class RabbitMQClient {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.confirmChannel = null;
    }
    connect(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.connection = yield amqplib_1.default.connect(url);
                this.channel = yield this.connection.createChannel();
                this.confirmChannel = yield this.connection.createConfirmChannel();
                console.log('Connected to RabbitMQ...');
                yield this.config();
                yield this.configOrders();
                yield this.consumeWarehouses();
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
            if (this.channel) {
                try {
                    yield this.channel.assertExchange('products.exchange', 'topic');
                }
                catch (error) {
                    console.log('From Rabbitmq Client...  ', error);
                }
            }
        });
    }
    configOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.confirmChannel) {
                yield this.confirmChannel.assertExchange(queues_1.unroutedOrderQueue.exchange, 'direct', {
                    durable: true,
                });
                yield this.confirmChannel.assertExchange(queues_1.newOrderQueue.exchange, 'direct', {
                    durable: true,
                    alternateExchange: queues_1.unroutedOrderQueue.exchange,
                });
                yield this.confirmChannel.assertQueue(queues_1.unroutedOrderQueue.name, {
                    durable: true,
                    arguments: {
                        'x-queue-type': 'quorum',
                        'x-single-active-consumer': true,
                    },
                });
                yield this.confirmChannel.assertQueue(queues_1.newOrderQueue.name, {
                    durable: true,
                    arguments: {
                        'x-queue-type': 'quorum',
                        'x-single-active-consumer': true,
                    },
                });
                yield this.confirmChannel.bindQueue(queues_1.newOrderQueue.name, queues_1.newOrderQueue.exchange, queues_1.newOrderQueue.key);
                yield this.confirmChannel.bindQueue(queues_1.unroutedOrderQueue.name, queues_1.unroutedOrderQueue.exchange, queues_1.unroutedOrderQueue.key);
            }
        });
    }
    consumeWarehouses() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.channel) {
                try {
                    yield this.channel.assertQueue(queues_1.newWarehouseQueue.name, {
                        durable: true,
                    });
                    yield this.channel.bindQueue(queues_1.newWarehouseQueue.name, queues_1.newWarehouseQueue.exchange, queues_1.newWarehouseQueue.key);
                    yield this.channel.consume(queues_1.newWarehouseQueue.name, (msg) => {
                        if (msg) {
                            const payload = JSON.parse(msg.content.toString());
                            domain_events_1.default.emit('NewWarehouse', {
                                payload: new new_warehouse_1.NewWarehouse(warehouse_model_1.Warehouse.map(payload)),
                                ack: () => {
                                    var _a;
                                    console.log('acking msg %s', msg);
                                    (_a = this.channel) === null || _a === void 0 ? void 0 : _a.ack(msg);
                                },
                            });
                        }
                    }, {
                        noAck: false,
                    });
                }
                catch (error) {
                    console.log('Error on warehouse consuption.', error.message);
                }
            }
        });
    }
    publish(exchange, routingKey, payload, options) {
        var _a;
        return (_a = this.channel) === null || _a === void 0 ? void 0 : _a.publish(exchange, routingKey, payload, options);
    }
    confirmedPublish(exchange, routingKey, payload, options, confirmationCallback) {
        var _a;
        return (_a = this.confirmChannel) === null || _a === void 0 ? void 0 : _a.publish(exchange, routingKey, payload, options, confirmationCallback);
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                yield ((_a = this.channel) === null || _a === void 0 ? void 0 : _a.close());
                yield ((_b = this.connection) === null || _b === void 0 ? void 0 : _b.close());
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
