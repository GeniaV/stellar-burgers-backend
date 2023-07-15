import express from 'express';
import mongoose from 'mongoose';
import { PORT, DB_URL } from './config';
import { ingredientData } from './defaulData';

const app = express();

app.use(express.json());

async function main() {
  await mongoose.connect(DB_URL);
   await ingredientData.save();
}

main().catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

