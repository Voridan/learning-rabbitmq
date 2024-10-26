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
const product_service_1 = __importDefault(require("./services/product.service"));
const rabbitmq_client_1 = __importDefault(require("./infrastructure/broker/rabbitmq.client"));
require("./domain/events/handlers");
const express_handlebars_1 = require("express-handlebars");
const warehouse_repository_1 = __importDefault(require("./repositories/warehouse.repository"));
const product_repository_1 = __importDefault(require("./repositories/product.repository"));
const cache_1 = require("./util/cache");
const helpers_1 = require("./util/helpers");
const app = (0, express_1.default)();
const port = 5005;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.engine('.hbs', (0, express_handlebars_1.engine)({
    extname: '.hbs',
    layoutsDir: path_1.default.join(__dirname, 'public', 'views', 'layouts'),
    helpers: {
        ifEquals: function (arg1, arg2, options) {
            return arg1 === arg2 ? options.fn(this) : options.inverse(this);
        },
    },
}));
app.set('view engine', '.hbs');
app.set('views', path_1.default.join(__dirname, 'public', 'views'));
app.get('/health', (req, res) => {
    res.status(200).send();
});
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let products;
    const selectedCategory = req.query.category || '';
    if (selectedCategory) {
        cache_1.cache.prevCategory = selectedCategory;
        products = yield product_repository_1.default.getByCategory(selectedCategory.toLowerCase());
    }
    else {
        cache_1.cache.prevCategory = '';
        products = yield product_repository_1.default.getAll();
    }
    res.render('all-products', {
        cssFile: 'all-products.css',
        products,
        categories: ['Toys', 'Interior', 'Electronics', 'Housekeeping', 'Sport'],
    });
}));
app.get('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const warehouses = yield warehouse_repository_1.default.getAll();
    res.render('create', { warehouses, cssFile: 'new-product.css' });
}));
app.post('/new', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const { code, result } = yield product_service_1.default.createProduct(data);
        res.status(code).json({ result });
    }
    catch (error) {
        res.status(500).json({ message: 'unexpected server error' });
    }
}));
app.get('/topic/order-confirmed/:clientId', (req, res) => {
    const clientId = req.params.clientId || '';
    if (!clientId)
        return res.sendStatus(400);
    cache_1.cache.orders[clientId] = res;
    (0, helpers_1.setupSSE)(res, clientId);
    res.write(`data: ${JSON.stringify(`Connection established for clientId: ${clientId}`)}\n\n`);
});
app.post('/buy', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const sseRes = cache_1.cache.orders[body.clientId];
        yield product_service_1.default.processPurchase(body, sseRes);
        res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}));
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    yield rabbitmq_client_1.default.connect('amqp://localhost:5672');
    console.log(`running at http://localhost:${port}`);
}));
