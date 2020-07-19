import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import { register, login, patch_user, delete_user } from './routes/user';
import { createPost, getPost } from './routes/post';

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

app.post('/post', createPost);
app.get('/post', getPost);

app.use((_, res) => {
  return res.status(404).json({
    success: false,
    message: 'not found page',
  });
});

app.listen(port, async () => {
  console.log(`listening on port: ${port}`);
});
