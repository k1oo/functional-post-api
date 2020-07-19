import { MySQL } from 'fxsql';
const { CONNECT } = MySQL;

import dotenv from 'dotenv';

dotenv.config();

const DB_CONFIG = {
  HOST: process.env.DB_HOST,
  USERNAME: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,
  NAME: process.env.DB_NAME,
};

export const POOL = CONNECT({
  host: DB_CONFIG.HOST,
  user: DB_CONFIG.USERNAME,
  password: DB_CONFIG.PASSWORD,
  database: DB_CONFIG.NAME,
});
