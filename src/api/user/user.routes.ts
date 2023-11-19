import express from 'express';
import { getAllUsers } from './user.handlers';

export const userRouter = express.Router();

userRouter.post('/', async (req, res) => {
  const data = req.body;
  console.log(`got data: ${JSON.stringify(data)}`);

  res.json('invoked POST');
});

userRouter.get('/', async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
});
