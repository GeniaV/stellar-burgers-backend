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

const cookieParser = require('cookie-parser')

const app = express();

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

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});
