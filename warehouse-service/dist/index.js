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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const warehouse_service_1 = __importDefault(require("./services/warehouse.service"));
const rabbitmq_client_1 = __importDefault(require("./infrastructure/broker/rabbitmq.client"));
require("./domain/events/handlers");
const app = (0, express_1.default)();
const port = 5003;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'views', 'index.html'));
});
app.get('/health', (req, res) => {
    res.status(200).send();
});
app.post('/new', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {
            address: req.body.address,
            capacity: req.body.capacity,
            location: {
                longitude: req.body.longitude,
                latitude: req.body.latitude,
            },
        };
        const result = yield warehouse_service_1.default.createWarehouse(data);
        res.status(201).json({ result });
    }
    catch (error) {
        res.status(500).json({ message: 'unexpected server error' });
    }
}));
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    yield rabbitmq_client_1.default.connect('amqp://localhost:5672');
    console.log(`running at http://localhost:${port}`);
}));
