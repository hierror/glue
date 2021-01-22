import * as OmieService from '../../services/omie/omie.service.js';
import { HotmartClient } from '../../resources/client/client.resource.js';
import { HotmartPurchase } from '../../resources/purchase/purchase.resource.js';
import Client from '../../resources/client/client.model.js';
import Purchase from '../../resources/purchase/purchase.model.js';

export const purchaseApproved = async (ctx, next) => {
    const data = ctx.request.body;

    console.log(`(New purchase)
    Transaction ID: ${data.transaction}\n\n`);

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
        console.log(`(New client)
        Client DOCS: ${data.docs}\n\n`);

        try {
            // Criação do registro do cliente no banco de dados
            let { name, docs, email } = client;

            console.log(`(Registering new client in database)
            Client: ${name}, ${docs}, ${email}\n\n`);

            await Client.create({
                name,
                docs,
                email
            });

            // Criação do registro do cliente na Omie
            console.log(`(Registering new client at Omie)\n\n`);
            
            const tags = [ { 'tag': 'Hotmart' }];

            if (client.type === 'SELLER') {
                tags.push({ 'tag': 'Cliente' });
            } else {
                tags.push({ 'tag': 'Produtor' });
            }

            info.clientCode = await OmieService.registerClient(client, tags);
        } catch (e) {
            ctx.throw(500, e.message);
        }
    }

    client.setCode(info.clientCode);

    let purchaseData;
    const purchase = new HotmartPurchase(data.receiver_type, data, client.code);

    try {
        // Criação do registro da compra no banco de dados
        let { purchaseCode, clientCode } = purchase;

        console.log(`(Registering new purchase in database)
        Purchase: ${purchaseCode}\n\n`);

        await Purchase.create({
            purchaseCode,
            clientCode
        });

        // Criação do registro da compra na Omie
        console.log(`(Registering new purchase at Omie)\n\n`);

        let accounts = await OmieService.getCheckingAccounts();
        let regex = /hotmart/i;

        accounts = accounts.filter((curr) => regex.test(curr['descricao']));

        purchaseData = await OmieService.registerNewPurchase(purchase, accounts[0]["nCodCC"]);
    } catch (e) {
        ctx.throw(500, e.message);
    }

    ctx.status = 201;
    ctx.body = {
        status: 'success',
        message: 'New Hotmart Purchase registered',
        payload: { ...purchaseData }
    };
};

export const purchaseCompleted = async (ctx, next) => {
    const transactionId = ctx.request.body.transaction;

    console.log(`(Purchase completed)
    Transaction ID: ${transactionId}\n\n`);

    const exists = await OmieService.purchaseExists(transactionId);

    if (!exists) {
        ctx.status = 500;
        ctx.body = {
            status: 'error',
            message: 'Hotmart Purchase isn\'t registered',
            payload: null
        };    
    } else {
        await OmieService.confirmPurchasePayment(transactionId);

        ctx.status = 204;
        ctx.body = {
            status: 'success',
            message: 'Hotmart Purchase payment confirmed',
            payload: null
        };
    }
};