import { INewWarehouse } from './interface/warehouse.interface';
import express from 'express';
import path from 'path';
import warehouseService from './services/warehouse.service';
import rabbitmq from './infrastructure/broker/rabbitmq.client';
import './domain/events/handlers';
const app = express();
const port = 5003;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/health', (req, res) => {
  res.status(200).send();
});

app.post('/new', async (req, res) => {
  try {
    const data: INewWarehouse = {
      address: req.body.address,
      capacity: req.body.capacity,
      location: {
        longitude: req.body.longitude,
        latitude: req.body.latitude,
      },
    };
    const result = await warehouseService.createWarehouse(data);

    res.status(201).json({ result });
  } catch (error) {
    res.status(500).json({ message: 'unexpected server error' });
  }
});

app.listen(port, async () => {
  await rabbitmq.connect('amqp://localhost:5672');
  console.log(`running at http://localhost:${port}`);
});
