const Koa = require('koa');
const err = require('./helpers/error');
const cors = require('@koa/cors');
const bodyParser = require('koa-body');
const logger = require('koa-logger');

const app = new Koa();
const router = require('./routes');

app.use(err);
app.use(cors());
app.use(bodyParser());
app.use(logger());

app.use(router.routes());

app.on('error', (err, ctx) => {
    console.error(err);
});

exports.start = (port) => {
    console.log(`Starting the server on port ${port}...`);
    app.listen(port);
};