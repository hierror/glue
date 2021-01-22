export const validator =  async (ctx, next) => {
    const data = ctx.request.body;

    if (!(parseFloat(data.cms_vendor) || parseFloat(data.cms_aff))) {
        ctx.status = 400;
        ctx.body = {
            message: 'Free gifts aren\'t registered'
        }
    } else {
        await next();
    }
};