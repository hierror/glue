import fetch from 'node-fetch';

/**
 * Every OMIE API call needs to have the credentials, the specified call and the parameters
 */

async function callOmieAPI ({ method, endpoint, call, parameters }) {
    const url = process.env.OMIE_API_BASE_URL + endpoint;
    const credentials = {
        app_key: process.env.OMIE_API_KEY,
        app_secret:process.env.OMIE_API_SECRET
    }

    const response = await fetch(url, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            call: call,
            ...credentials,
            param: [ parameters ]
        })
    });

    return response.json();
}

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
    
    const options = {
        method: 'POST',
        endpoint,
        call,
        param
    };

    try {
        data = await callOmieAPI(options);
    } catch (e) {
        throw new Error('Error on checking if user is registered');
    }

    const info = {
        registered: (data['registros'] === 1),
        clientCode: data['clientes_cadastro_resumido'][0]['codigo_cliente']
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

    let param = {};

    param['razao_social'] = client.name;
    param['nome_fantasia'] = client.name;
    param['contato'] = client.name;
    param['tags'] = tags;

    if (client.type === 'SELLER') {
        param['email'] = client.email;
        param['cpnj_cpf'] = client.docs;
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
        data = await callOmieAPI('POST', endpoint, call, param);
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
export async function registerNewPurchase(purchase) {
    let data;
    const call = 'IncluirContaReceber';
    const endpoint = '/financas/contareceber/';

    let param = {
        "codigo_lancamento_integracao": purchase.purchaseCode,
        "codigo_cliente_fornecedor": purchase.clientCode,
        "data_vencimento": purchase.getReceivingDate(),
        "codigo_categoria": "1.01.02", // Infoproduto
        "data_previsao": purchase.getReceivingDate(),
        "id_conta_corrente":  process.env.CONTA_CORRENTE // Desenvolver método que buscar por conta corrente 
    };
    
    try {
        data = await callOmieAPI('POST', endpoint, call, param);
    } catch (e) {
        throw new Error('Error on purchase registration');
    }

    return data['codigo_cliente_omie'];
};