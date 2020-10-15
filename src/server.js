import Koa from 'koa';
import err from './helpers/error.js';
import cors from '@koa/cors';
import bodyParser from 'koa-body';
import logger from 'koa-logger';

const app = new Koa();
import router from './routes.js';

app.use(err);
app.use(cors());
app.use(bodyParser());
app.use(logger());

app.use(router.routes());

app.on('error', (err, ctx) => {
    console.error(err);
});

export default (port) => {
    console.log(`Starting the server on port ${port}...`);
    app.listen(port);
};