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
const express_handlebars_1 = require("express-handlebars");
const http_proxy_middleware_1 = require("http-proxy-middleware");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
app.engine('.hbs', (0, express_handlebars_1.engine)({
    extname: '.hbs',
    defaultLayout: false,
    helpers: {
        ifEquals: function (arg1, arg2, options) {
            return arg1 === arg2 ? options.fn(this) : options.inverse(this);
        },
    },
}));
app.set('view engine', '.hbs');
app.set('views', path_1.default.join(__dirname, 'views'));
const services = {
    monitoring: {
        path: '/monitoring',
        target: 'http://localhost:5000',
    },
    orders: {
        path: '/orders',
        target: 'http://localhost:5001',
    },
    transportation: {
        path: '/transportation',
        target: 'http://localhost:5002',
    },
    warehouse: {
        path: '/warehouse',
        target: 'http://localhost:5003',
    },
    'post-offices': {
        path: '/post-offices',
        target: 'http://localhost:5004',
    },
    products: {
        path: '/products',
        target: 'http://localhost:5005',
    },
};
const checkMicroservisecHealth = () => __awaiter(void 0, void 0, void 0, function* () {
    const healthStatuses = {};
    yield Promise.all(Object.entries(services).map((_a) => __awaiter(void 0, [_a], void 0, function* ([key, service]) {
        try {
            const response = yield fetch(`${service.target}/health`);
            if (response.status === 200) {
                healthStatuses[key] = 'Healthy';
            }
            else {
                healthStatuses[key] = 'Unhealthy';
            }
        }
        catch (error) {
            healthStatuses[key] = 'Unhealthy';
        }
    })));
    console.log(healthStatuses);
    return healthStatuses;
});
Object.values(services).forEach((service) => {
    app.use(service.path, (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: service.target,
        changeOrigin: true,
        pathRewrite: (path) => path.replace(service.path, ''),
        on: {
            proxyReq: (proxyReq, req, res) => {
                console.log(`Proxying request from ${req.url} to ${service.target}`);
            },
        },
    }));
});
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const healthStatuses = yield checkMicroservisecHealth();
    res.render('index', { healthStatuses });
}));
app.listen(port, () => {
    console.log(`API Gateway is running at http://localhost:${port}`);
});
