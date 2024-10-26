import express from 'express';
import { engine } from 'express-handlebars';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';

const app = express();
const port = 3000;

interface HandlebarsHelperOptions {
  fn: (context?: unknown) => string;
  inverse: (context?: unknown) => string;
}

type Key = keyof typeof services;

app.engine(
  '.hbs',
  engine({
    extname: '.hbs',
    defaultLayout: false,
    helpers: {
      ifEquals: function (
        arg1: unknown,
        arg2: unknown,
        options: HandlebarsHelperOptions
      ) {
        return arg1 === arg2 ? options.fn(this) : options.inverse(this);
      },
    },
  })
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

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
} as const;

const checkMicroservisecHealth = async () => {
  const healthStatuses: {
    [key in Key]?: 'Healthy' | 'Unhealthy';
  } = {};

  await Promise.all(
    Object.entries(services).map(async ([key, service]) => {
      try {
        const response = await fetch(`${service.target}/health`);
        if (response.status === 200) {
          healthStatuses[key as Key] = 'Healthy';
        } else {
          healthStatuses[key as Key] = 'Unhealthy';
        }
      } catch (error) {
        healthStatuses[key as Key] = 'Unhealthy';
      }
    })
  );
  console.log(healthStatuses);

  return healthStatuses;
};

Object.values(services).forEach((service) => {
  app.use(
    service.path,
    createProxyMiddleware({
      target: service.target,
      changeOrigin: true,
      pathRewrite: (path) => path.replace(service.path, ''),
      on: {
        proxyReq: (proxyReq, req, res) => {
          console.log(`Proxying request from ${req.url} to ${service.target}`);
        },
      },
    })
  );
});

app.get('/', async (req, res) => {
  const healthStatuses = await checkMicroservisecHealth();
  res.render('index', { healthStatuses });
});

app.listen(port, () => {
  console.log(`API Gateway is running at http://localhost:${port}`);
});
