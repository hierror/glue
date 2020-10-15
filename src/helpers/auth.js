export const HotmartAuth = async (ctx, next) => {
    const requestToken = ctx.request.body.hottok.trim();
    const authToken = process.env.HOTMART_TOKEN.trim();

    if (authToken != requestToken) {
        ctx.throw(401, 'Hotmart token is invalid or inexistent');
    } else {
        await next();
    }    
};