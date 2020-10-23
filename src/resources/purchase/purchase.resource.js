export class HotmartPurchase {
    constructor(type, json, client) {
        const PAYMENT_WARRANTY_RANGE = 31;
        
        this.purchaseCode = json.transaction;
        this.clientCode = client;
        this.purchaseApprovedDate = new Date(json.confirmation_purchase_date);
        this.receivingDate = new Date(this.purchaseApprovedDate.getTime());

        this.receivingDate.setDate(this.receivingDate.getDate() + PAYMENT_WARRANTY_RANGE);

        if (type === 'SELLER') {
            this.value = json.cms_vendor;
        } else if (type === 'AFFILIATE') {  
            this.value = json.cms_aff;
        } else {
            ctx.throw(400, 'Unknown receiver type on purchase creation')
        }
    }

    getReceivingDate() {
        return this.receivingDate.toLocaleDateString('pt-BR');
    }
}