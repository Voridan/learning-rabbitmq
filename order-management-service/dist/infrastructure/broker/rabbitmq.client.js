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
                yield this.configOrders();
                yield this.consumeNewOrders();
                console.log('Configured...');
            }
            catch (error) {
                console.error('Error connecting to RabbitMQ:', error);
                throw error;
            }
        });
    }
    configOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.channel) {
                yield this.channel.assertQueue(queues_1.newOrderQueue.name, {
                    durable: true,
                    arguments: {
                        'x-queue-type': 'quorum',
                        'x-single-active-consumer': true,
                    },
                });
            }
        });
    }
    consumeNewOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.channel) {
                this.channel.consume(queues_1.newOrderQueue.name, (msg) => {
                    if (msg) {
                        const payload = JSON.parse(msg.content.toString());
                        domain_events_1.default.emit('ProductPurchase', {
                            payload,
                            ack: () => {
                                var _a;
                                console.log('acking msg %s', msg);
                                (_a = this.channel) === null || _a === void 0 ? void 0 : _a.ack(msg);
                            },
                        });
                    }
                });
            }
        });
    }
}
exports.RabbitMQClient = RabbitMQClient;
const rabbitmq = new RabbitMQClient();
exports.default = rabbitmq;
