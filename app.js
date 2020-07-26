import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import { register, login, patch_user, delete_user } from './routes/user';
import { create_post, get_post, patch_post, delete_post } from './routes/post';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan());

app.get('/status', (req, res) => {
  return res.json({
    success: true,
  });
});

app.post('/register', register);
app.post('/login', login);
app.patch('/user', patch_user);
app.delete('/user', delete_user);

app.post('/post', create_post);
app.get('/post', get_post);
app.patch('/post', patch_post);
app.delete('/post', delete_post);

app.use((_, res) => {
  return res.status(404).json({
    success: false,
    message: 'not found page',
  });
});

app.listen(port, async () => {
  console.log(`listening on port: ${port}`);
});
