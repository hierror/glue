import dotenv from 'dotenv';
import start from './src/server.js';

dotenv.config();
process.env['CONTA_CORRENTE'] = 2144346825; // To REMOVE

start(process.env.PORT);