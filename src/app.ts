import express from 'express';
import mongoose from 'mongoose';
import { PORT, DB_URL } from './config';
import { createDefaultIngredientsData } from './defaulData';
import ingredientsRouter from './routes/ingredients';
import errorHandler from './middlewares/errors';

const app = express();

app.use(express.json());

async function main() {
  await mongoose.connect(DB_URL);

  createDefaultIngredientsData().catch((err) => {
    console.error(err);
  });
};

main().catch((err) => console.log(err));

app.use('/', ingredientsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});
