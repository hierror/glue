import * as OmieService from '../../services/omie/omie.service.js';
import { HotmartClient } from '../../resources/client/client.resource.js';

export const purchaseApproved = async (ctx, next) => {
    const data = ctx.request.body;
    const client = new HotmartClient(data.receiver_type, data);

    let info;

    try {
        const fields = {
            docs: client.docs,
            email: client.email,
            name: client.name
        }

        info = await OmieService.isClientRegistered(fields);
    } catch (e) {
        ctx.throw(500, e.message);
    }

    if (!info.registered) {
        try {
            const tags = ['Hotmart'];

            if (client.type === 'SELLER') {
                tags.push('Produtor');
            } else {
                tags.push('Cliente');
            }

            info.clientCode = await OmieService.registerClient(client, tags);
        } catch (e) {
            ctx.throw(500, e.message);
        }
    }

    client.setCode(info.clientCode);

    const purchase = new HotmartPurchase(data.receiver_type, data, client.code);

    try {
        let accounts = await OmieService.getCheckingAccounts();
        let regex = /Hotmart/;

        accounts = accounts.filter((curr) => regex.test(curr['descricao']));

        const purchase = await OmieService.registerNewPurchase(purchase, accounts[0]);
    } catch (e) {
        ctx.throw(500, e.message);
    }

    ctx.status = 201;
    ctx.body = {
        status: 'success',
        message: 'New Hotmart Purchase registered',
        payload: { ...purchase }
    };
};

export const purchaseCompleted = async (ctx, next) => {
    const data = ctx.request.body;
    const purchaseCode = data.transaction;

    await OmieService.confirmPurchasePayment(purchaseCode);

    ctx.status = 204;
    ctx.body = {
        status: 'success',
        message: 'Hotmart Purchase payment confirmed',
        payload: null
    };
};