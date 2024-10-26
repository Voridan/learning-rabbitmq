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
const express_handlebars_1 = require("express-handlebars");
const rabbitmq_client_1 = __importDefault(require("./infrastructure/broker/rabbitmq.client"));
require("./domain/events/handlers");
const warehouse_service_1 = __importDefault(require("./services/warehouse.service"));
const product_repository_1 = __importDefault(require("./repositories/product.repository"));
const app = (0, express_1.default)();
const port = 5000;
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
app.get('/', (req, res) => {
    res.render('home', { cssFile: 'home.css' });
});
app.get('/health', (req, res) => {
    res.status(200).send();
});
app.get('/warehouses', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const warehouses = yield warehouse_service_1.default.getAll();
    res.render('warehouses', { cssFile: 'warehouses.css', warehouses });
}));
app.get('/postoffices', (req, res) => {
    res.render('postoffices', { cssFile: 'postoffices.css' });
});
app.get('/orders', (req, res) => {
    res.render('orders', { cssFile: 'orders.css' });
});
app.get('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let products;
    const selectedCategory = req.query.category || '';
    if (selectedCategory) {
        products = yield product_repository_1.default.getByCategory(selectedCategory.toLowerCase());
    }
    else {
        products = yield product_repository_1.default.getAll();
    }
    res.render('products', {
        cssFile: 'products.css',
        products,
        categories: ['Toys', 'Interior', 'Electronics', 'Housekeeping', 'Sport'],
    });
}));
app.get('/transports', (req, res) => {
    res.render('transports', { cssFile: 'transports.css' });
});
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    yield rabbitmq_client_1.default.connect('amqp://localhost:5672');
    console.log(`API Gateway is running at http://localhost:${port}`);
}));
