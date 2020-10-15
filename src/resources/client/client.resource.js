export class HotmartClient {
    constructor(type, json) {
        if (type === 'SELLER') {
            this.name = json.name;
            this.docs = json.doc;
            this.phone = json.phone_number;
            this.phoneCode = json.phone_local_code;
            this.adress = json.adress;
            this.adressNumber = json.adress_number;
            this.district = json.adress_district;
            this.complement = json.adress_comp;
            this.city = json.adress_city;
            this.state = json.adress_state;
            this.zipCode = json.adress_zip_code;
            this.email = json.email;
        } else if (type === 'AFFILIATE') {
            this.name = producer.name;
        } else {
            ctx.throw(400, 'Unknown receiver type on client creation')
        }
    
        this.type = type;
        this.countryCode = '1058';
        this.code = null;
    }

    setCode(code) {
        this.code = code;
    }
}