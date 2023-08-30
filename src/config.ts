import 'dotenv/config';
import { join } from 'path';

require('dotenv').config({ path: join(__dirname, '..', '..', '.env')});

const {
  PORT = 4000,
  DB_URL = 'mongodb://database:27017/stellarburgerdb',
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = process.env;

export {  PORT, DB_URL, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET };