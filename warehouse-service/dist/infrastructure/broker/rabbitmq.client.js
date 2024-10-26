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
const new_product_1 = require("../../domain/models/new.product");
class RabbitMQClient {
    constructor() {
        this.connection = null;
        this.channel = null;
    }
    connect(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.connection = yield amqplib_1.default.connect(url);
                this.channel = yield this.connection.createChannel();
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
            if (this.channel) {
                try {
                    yield this.channel.assertExchange('warehouses.exchange', 'topic');
                    const { name, exchange, key } = queues_1.newProductQueue;
                    yield this.channel.assertQueue(name, {
                        durable: true,
                    });
                    yield this.channel.bindQueue(name, exchange, key);
                    this.channel.consume(name, (msg) => {
                        if (msg) {
                            const product = JSON.parse(msg.content.toString());
                            domain_events_1.default.emit('NewProduct', new new_product_1.NewProduct({
                                quantity: product.quantity,
                                warehouseId: product.warehouseId,
                            }));
                            this.channel.ack(msg);
                        }
                    }, { noAck: false });
                }
                catch (err) {
                    console.log(err);
                }
            }
        });
    }
    publish(exchange, routingKey, payload, options) {
        var _a;
        return (_a = this.channel) === null || _a === void 0 ? void 0 : _a.publish(exchange, routingKey, payload, options);
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
