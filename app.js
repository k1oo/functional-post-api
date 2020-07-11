import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import morgan from 'morgan';

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan());

app.get('/status', (req, res) => {
  return res.json({
    success: true,
  });
});

app.use((_, res) => {
  return res.status(404).json({
    success: false,
    message: 'not found page',
  });
});
