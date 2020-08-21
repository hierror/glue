module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = {
            message: err.message || 'Internal Server Error'
        }

        ctx.app.emit('error', err, ctx);
    }
};