import dotenv from 'dotenv';
import start from './src/server.js';

dotenv.config();
process.env.CHECKING_ACCOUNT = 2144346825; // To REMOVE

start(process.env.PORT);