export const HotmartAuth = async (ctx, next) => {
    const requestToken = ctx.request.body.hottok.trim();
    const authToken = process.env.HOTMART_TOKEN.trim();

    if (authToken != requestToken) {
	console.log(authToken, requestToken, process.env);
        ctx.throw(401, 'Hotmart token is invalid or inexistent');
    } else {
        await next();
    }    
};
