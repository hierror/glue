import fetch from 'node-fetch';
import Purchase from '../../resources/purchase/purchase.model.js';
import Client from '../../resources/client/client.model.js';

/**
 * Every OMIE API call needs to have the credentials, the specified call and the parameters
 */

async function callOmieAPI ({ method, endpoint, call, param }) {
    const url = process.env.OMIE_API_BASE_URL + endpoint;
    const credentials = {
        app_key: process.env.OMIE_API_KEY,
        app_secret:process.env.OMIE_API_SECRET
    }

    const body = JSON.stringify({
        call: call,
        ...credentials,
        param: [ param ]
    });

    const response = await fetch(url, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body
    });

    return response.json();
}

export async function getCheckingAccounts() {
    let data;
    const call = 'ListarContasCorrentes';
    const endpoint = '/geral/contacorrente/';

    const param = {
        'pagina': 1,
        'registros_por_pagina': 50,
        'apenas_importado_api': 'N'
    }

    try {
        data = await callOmieAPI({
            method: 'POST',
            endpoint,
            call,
            param
        });
    } catch (e) {
        throw new Error('Error on listing checking accounts');
    }

    return data['ListarContasCorrentes'];
};

/**
 * Checking if the client already exists
*/
export async function isClientRegistered({ docs, email, name }) {
    let data;
    const call = 'ListarClientesResumido';
    const endpoint = '/geral/clientes/';

    let filter;

    if (docs) {
        filter = {'cnpj_cpf': docs};
    } else if (email) {
        filter = {'email': email};
    } else {
        filter = {'razao_social': name};
    }

    const param = {
        'pagina': 1,
        'registros_por_pagina': 50,
        'apenas_importado_api': 'N',
        'clientesFiltro': filter
    }

    try {
        data = await callOmieAPI({
            method: 'POST',
            endpoint,
            call,
            param
        });
    } catch (e) {
        throw new Error('Error on checking if user is registered');
    }

    const info = {
        registered: false,
        clientCode: null
    }

    if (data.hasOwnProperty('registros')) {
        info.registered = true;
        info.clientCode = data['clientes_cadastro_resumido'][0]['codigo_cliente']
    }

    return info;
};

/**
 * Registering new clients because every purchase needs its client to be specified
 */
export async function registerClient(client, tags) {
    let data;
    const call = 'IncluirCliente';
    const endpoint = '/geral/clientes/';
    const clientDB = await Client.findOne({ $or: [
        {'docs': client.docs},
        {'email': client.email}, 
        {'name': client.name}
    ]}).exec();

    let param = {};

    param['codigo_cliente_integracao'] = clientDB._id;
    param['razao_social'] = client.name;
    param['nome_fantasia'] = client.name;
    param['contato'] = client.name;
    param['tags'] = tags;

    console.log(tags);

    if (client.type === 'SELLER') {
        param['email'] = client.email;
        param['cnpj_cpf'] = client.docs;
        param['telefone1_ddd'] = client.phoneCode;
        param['telefone1_numero'] = client.phone;
        param['endereco'] = client.adress;
        param['endereco_numero'] = client.adressNumber;
        param['bairro'] = client.district;
        param['complemento'] = client.complement;
        param['estado'] = client.state;
        param['cidade'] = client.city;
        param['cep'] = client.zipCode;
    }
     
    try {
        data = await callOmieAPI({
            method: 'POST',
            endpoint,
            call,
            param
        });
    } catch (e) {
        throw new Error('Error on user registration');
    }

    if (data['codigo_status'] !== '0')
        throw new Error('Error on user registration');

    return data['codigo_cliente_omie'];
};


/**
 * 
 */
export async function registerNewPurchase(purchase, checkingAccount) {
    let data;
    const call = 'IncluirContaReceber';
    const endpoint = '/financas/contareceber/';
    const purchaseDB = await Purchase.findOne({ purchaseCode: purchase.purchaseCode }).exec();

    let param = {
        "codigo_lancamento_integracao": purchaseDB._id,
        "codigo_cliente_fornecedor": purchase.clientCode,
        "data_vencimento": purchase.getReceivingDate(),
        "valor_documento": purchase.value,
        "codigo_categoria": "1.01.02", // Infoproduto
        "data_previsao": purchase.getReceivingDate(),
        "id_conta_corrente": checkingAccount || process.env.CHECKING_ACCOUNT // Desenvolver método que buscar por conta corrente 
    };

    try {
        data = await callOmieAPI({
            method: 'POST',
            endpoint,
            call,
            param
        });
    } catch (e) {
        throw new Error('Error on purchase registration');
    }

    return data;
};

/*
export async function cancelPurchasePayment(purchaseCode) {
    let data;
    const call = 'CancelarRecebimento';
    const endpoint = '/financas/contareceber/';

    let param = {
        "codigo_baixa_integracao": purchaseCode,
    };
    
    try {
        data = await callOmieAPI('POST', endpoint, call, param);
    } catch (e) {
        throw new Error('Error on purchase\'s payment canceletion');
    }

    return data;
};
*/

export async function confirmPurchasePayment(purchaseCode) {
    let data;
    const call = 'LancarRecebimento';
    const endpoint = '/financas/contareceber/';

    let param = {
        "codigo_lancamento_integracao": purchaseCode,
    };
    
    try {
        data = await callOmieAPI({
            method: 'POST',
            endpoint,
            call,
            param
        });
    } catch (e) {
        throw new Error('Error on purchase\'s payment confirmation');
    }

    return data;
};

export async function purchaseExists(purchaseCode) {
    let data;
    const call = 'ConsultarContaReceber';
    const endpoint = '/financas/contareceber/';
    const purchaseDB = await Purchase.findOne({ purchaseCode: purchase.purchaseCode }).exec();

    let param = {
        "codigo_lancamento_integracao": purchaseDB.purchaseCode,
    };
    
    try {
        // Criação do registro de compra completa no banco de dados
        await Purchase.updateOne({ _id: purchaseDB.purchaseCode}, { 
            $set: { completedAt: Date.now() }
        });

        // Criação do registro de compra completa na Omie
        data = await callOmieAPI({
            method: 'POST',
            endpoint,
            call,
            param
        });
    } catch (e) {
        throw new Error('Error on purchase\'s payment consult');
    }

    return data.includes("codigo_lancamento_integracao");
};