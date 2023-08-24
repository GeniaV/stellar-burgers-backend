import express from 'express';
import mongoose from 'mongoose';
import { PORT, DB_URL } from './config';
import { createDefaultIngredientsData } from './defaulData';
import ingredientsRouter from './routes/ingredients';
import errorHandler from './middlewares/errors';
import accessControlAllowMiddlware from './middlewares/cors';
import authRouter from './routes/auth';
import ordersRouter from './routes/orders';
import { errors } from 'celebrate';
import { requestLogger, errorLogger } from './middlewares/logger';
import * as WebSocket from "ws"
import * as url from 'url';
import { handleOrdersAll, handleOrders, buildOrderResponse } from './controllers/wsOrders';
import Order from './models/orders';
import Agenda, { Job } from 'agenda';

const http = require('http')
const cookieParser = require('cookie-parser')

const app = express();

const server = http.createServer(app)

const wss = new WebSocket.Server({ server });

export const agenda = new Agenda({ db: { address: DB_URL } });

agenda.define('updateOrderStatus', async (job: Job) => {
  const { orderId } = job.attrs.data;

  const order = await Order.findById(orderId);
  if (order) {
    order.status = "done";
    await order.save();

    const response = await buildOrderResponse();
    clients.forEach(client => {
      client.send(JSON.stringify(response));
    });
  }
});

app.use(accessControlAllowMiddlware);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

async function main() {
  await mongoose.connect(DB_URL);

  createDefaultIngredientsData().catch((err) => {
    console.error(err);
  });
};

main().catch((err) => console.log(err));

app.use(requestLogger);

app.use(cookieParser());

app.use('/', ingredientsRouter);

app.use('/', authRouter);

app.use('/', ordersRouter);

export const clients: WebSocket[] = [];

wss.on('connection', (ws: WebSocket, req) => {
  const parsedUrl = url.parse(req.url!, true);
  const token = parsedUrl.query.token as string;

  if (parsedUrl.pathname === '/orders/all') {
    clients.push(ws);
    handleOrdersAll(ws);
  } else if (parsedUrl.pathname === '/orders') {
    handleOrders(ws, token);
  } else {
    ws.close(1000, 'Unknown route');
  }

  ws.on('close', () => {
    const index = clients.indexOf(ws);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});
