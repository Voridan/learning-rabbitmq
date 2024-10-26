import express from 'express';
import path from 'path';
import { engine } from 'express-handlebars';
import rabbitmq from './infrastructure/broker/rabbitmq.client';
import './domain/events/handlers';
import warehouseService from './services/warehouse.service';
import productRepo from './repositories/product.repository';
import { IProduct } from './interface/product.interface';

const app = express();
const port = 5000;

interface HandlebarsHelperOptions {
  fn: (context?: unknown) => string;
  inverse: (context?: unknown) => string;
}

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

app.get('/', (req, res) => {
  res.render('home', { cssFile: 'home.css' });
});

app.get('/health', (req, res) => {
  res.status(200).send();
});

app.get('/warehouses', async (req, res) => {
  const warehouses = await warehouseService.getAll();
  res.render('warehouses', { cssFile: 'warehouses.css', warehouses });
});

app.get('/postoffices', (req, res) => {
  res.render('postoffices', { cssFile: 'postoffices.css' });
});

app.get('/orders', (req, res) => {
  res.render('orders', { cssFile: 'orders.css' });
});

app.get('/products', async (req, res) => {
  let products: IProduct[];
  const selectedCategory = (req.query.category as string) || '';
  if (selectedCategory) {
    products = await productRepo.getByCategory(selectedCategory.toLowerCase());
  } else {
    products = await productRepo.getAll();
  }

  res.render('products', {
    cssFile: 'products.css',
    products,
    categories: ['Toys', 'Interior', 'Electronics', 'Housekeeping', 'Sport'],
  });
});

app.get('/transports', (req, res) => {
  res.render('transports', { cssFile: 'transports.css' });
});

app.listen(port, async () => {
  await rabbitmq.connect('amqp://localhost:5672');
  console.log(`API Gateway is running at http://localhost:${port}`);
});
