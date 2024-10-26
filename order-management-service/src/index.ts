import path from 'path';
import express from 'express';
import { engine } from 'express-handlebars';
import rabbitmq from './infrastructure/broker/rabbitmq.client';
import './domain/events/handlers';
const app = express();
const port = 5001;

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/health', (req, res) => {
  res.status(200).send();
});

app.listen(port, async () => {
  await rabbitmq.connect('amqp://localhost:5672');
  console.log(`API Gateway is running at http://localhost:${port}`);
});
