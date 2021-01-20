import dotenv from 'dotenv';
import mongoose from 'mongoose';
import start from './src/server.js';

dotenv.config();
process.env.CHECKING_ACCOUNT = 1283128167; // To REMOVE

mongoose
  .connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connected to the database'))
  .catch(err => console.log(err));

start(process.env.PORT);