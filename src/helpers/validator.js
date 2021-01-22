export const validator =  async (ctx, next) => {
    const data = ctx.request.body;

    console.log('I WASSS IN THE VALIDATOR \n\n');
    console.log('produtor: ', data.cms_vendor);
    console.log('produtor: ', data.cms_aff);

    if (!(parseFloat(data.cms_vendor) || parseFloat(data.cms_aff))) {
        ctx.status = 400;
        ctx.body = {
            message: 'Free gifts aren\'t registered'
        }
    } else {
        await next();
    }
};