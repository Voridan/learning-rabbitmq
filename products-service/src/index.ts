import { INewProduct, IProduct } from './interface/product.interface';
import express from 'express';
import path from 'path';
import productService from './services/product.service';
import rabbitmq from './infrastructure/broker/rabbitmq.client';
import './domain/events/handlers';
import { engine } from 'express-handlebars';
import warehouseRepo from './repositories/warehouse.repository';
import productsRepo from './repositories/product.repository';
import { cache } from './util/cache';
import { setupSSE } from './util/helpers';
import { UUID } from 'crypto';
const app = express();
const port = 5005;

interface HandlebarsHelperOptions {
  fn: (context?: unknown) => string;
  inverse: (context?: unknown) => string;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.engine(
  '.hbs',
  engine({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'public', 'views', 'layouts'),
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
app.set('views', path.join(__dirname, 'public', 'views'));

app.get('/health', (req, res) => {
  res.status(200).send();
});

app.get('/', async (req, res) => {
  let products: IProduct[];
  const selectedCategory = (req.query.category as string) || '';
  if (selectedCategory) {
    cache.prevCategory = selectedCategory;
    products = await productsRepo.getByCategory(selectedCategory.toLowerCase());
  } else {
    cache.prevCategory = '';
    products = await productsRepo.getAll();
  }

  res.render('all-products', {
    cssFile: 'all-products.css',
    products,
    categories: ['Toys', 'Interior', 'Electronics', 'Housekeeping', 'Sport'],
  });
});

app.get('/create', async (req, res) => {
  const warehouses = await warehouseRepo.getAll();
  res.render('create', { warehouses, cssFile: 'new-product.css' });
});

app.post('/new', async (req, res) => {
  try {
    const data: INewProduct = req.body;
    const { code, result } = await productService.createProduct(data);

    res.status(code).json({ result });
  } catch (error) {
    res.status(500).json({ message: 'unexpected server error' });
  }
});

app.get('/topic/order-confirmed/:clientId', (req, res) => {
  const clientId = (req.params.clientId as string) || '';
  if (!clientId) return res.sendStatus(400);

  cache.orders[clientId] = res;
  setupSSE(res, clientId);

  res.write(
    `data: ${JSON.stringify(
      `Connection established for clientId: ${clientId}`
    )}\n\n`
  );
});

app.post('/buy', async (req, res) => {
  try {
    const body = req.body as {
      productId: UUID;
      quantity: number;
      clientId: string;
    };
    const sseRes = cache.orders[body.clientId];
    await productService.processPurchase(body, sseRes);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(port, async () => {
  await rabbitmq.connect('amqp://localhost:5672');
  console.log(`running at http://localhost:${port}`);
});
