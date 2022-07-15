const axios = require('axios');

const fecha = new Date();
const añoActual = fecha.getFullYear();
const nuevoAño = añoActual -1;
const mes = fecha.getMonth();
const mesMenosUno = mes -1;
const headers= {
    'X-API-Key': `${process.env.SATWS_APIKEY}`,
    'Content-Type': 'application/json'
}
const params =  {
    'options[from]': `${nuevoAño}-${mes}-01`
}

const urlInit = 'https://api.satws.com/';




const getSatTopClients = async (id) => {

    const instance = axios.create({
    baseURL:`${urlInit}insights/${id}/customer-concentration`,
    headers,
    params
    })
        
    try{
        const { data } = await instance.get();

        const ventas = data.data.reduce((a, b) => a + (b['total'] || 0), 0)
        const clientes =  data.data.map( data => {
            newdata = {};
            newdata.name = data.name;
            newdata.rfc = data.rfc;
            newdata.total = data.total;
            newdata.share = data.share; 
            let newtransactions = data.transactions.slice(-12);
            newdata.transactions = newtransactions;
            return newdata;
        })

        return {ventas, clientes};
    
    } catch(error){

        console.log('Error',error);
        return error;

    }
}
const getSatTopProv = async (id) => {

    const instance = axios.create({
        baseURL:`${urlInit}insights/${id}/supplier-concentration`,
        headers,
        params
        })
    try {
        const { data } = await instance.get();
        const gastos = data.data.reduce((a, b) => a + (b['total'] || 0), 0);
        const proveedores =  data.data.map( data => {
            newdata = {};
            newdata.name = data.name;
            newdata.rfc = data.rfc;
            newdata.total = data.total;
            newdata.share = data.share; 
            let newtransactions = data.transactions.slice(-12);
            newdata.transactions = newtransactions;
            return newdata;
        })
        
        return {gastos, proveedores};
        
    } catch (error) {
        console.log('Error',error);
        return error;
    }

}


const getSatBancos = async (id) => {

    const instance = axios.create({
        baseURL:`${urlInit}insights/${id}/financial-institutions`,
        headers,
        params
        });

    try {
        const { data } = await instance.get();
        const gastosfinancieros = data.data.reduce((a, b) => a + (b['total'] || 0), 0);
        const institucionesfinancieras =  data.data.map( data => {
            newdata = {};
            newdata.rfc = data.rfc;
            newdata.legalName = data.legalName;
            newdata.tradeName = data.tradeName;
            newdata.website = data.website; 
            newdata.sector = data.sector; 
            newdata.total = data.total; 
            let newtransactions = data.transactions.slice(-12);
            newdata.transactions = newtransactions;
            return newdata;
        })
        
        return {institucionesfinancieras, gastosfinancieros};
        
    } catch (error) {
        console.log('Error',error);
        return error;
    }
}

const invoiceExtraction = async  (id) => {
    

    const baseURL = `${urlInit}extractions`;
    const body =  {
                "taxpayer": `/taxpayers/${id}`,
                "extractor": "invoice",
                "options": {
                    "types": ["I","E","P","N","T"],
                    "period": { "from": `${nuevoAño}-${mesMenosUno}-01` }
                }
    };
    
    try {
        const response = await axios.post(baseURL,body,{headers});


        return response.data;
        
    } catch (error) {

        return error.response; 
    }
    

}

const validateInvoiceExtraction = async (id) => {


    const instance = axios.create({
        baseURL:`${urlInit}extractions/`,
        headers,
        params: {
            'taxpayer.id': id,
            'extractor': 'invoice'
        }
        });
        try {
            const { data } = await instance.get();

            return { items: data['hydra:totalItems'], member: data['hydra:member']};
            
        } catch (error) {

            return error;
        }

};

const validateCredentials = async (id) => {
    const instance = axios.create({
        baseURL:`${urlInit}credentials/`,
        headers,
        params: {
            'rfc': id,
        }
        });

        try {
            const {data} = await instance.get();

            const resp = data['hydra:member'];
            const number = data['hydra:totalItems'];

            return {resp, number}
            
        } catch (error) {
            console.log(error);
            return error
        }
    
}

const metaDataInsight = async ( id ) => {

    const instance = axios.create({
        baseURL:`${urlInit}insights/${id}/metadata`,
        headers
        })

        try {
            const {data} = await instance.get();
            return data

            
        } catch (error) {
            console.log(error);
            return error
        }
    

};

const balanceInsight = async ( id ) => {

    const instance = axios.create({
        baseURL:`${urlInit}insights/${id}/balance-sheet`,
        headers
        });
    
        try {
            const { data } = await instance.get();
            
            return data;
            
        } catch ( error ) {
            console.log(error);
            return error
        }
}

const incomeInsight = async ( id ) => {

    const instance = axios.create({
        baseURL:`${urlInit}insights/${id}/income-statement`,
        headers
        });

        try {
            const { data } = await instance.get();
            
            return data;
            
        } catch ( error ) {
            console.log(error);
            return error
        }

}
const financialRatios = async ( id ) => {

    const instance = axios.create({
        baseURL:`${urlInit}insights/${id}/financial-ratios`,
        headers
        });

        try {
            const { data } = await instance.get();
            
            return data;
            
        } catch ( error ) {
            console.log(error);
            return error
        }

}
const financialRisks = async ( id ) => {

    const instance = axios.create({
        baseURL:`${urlInit}insights/${id}/risks`,
        headers
        });

        try {
            const { data } = await instance.get();
            
            return data;
            
        } catch ( error ) {
            console.log(error);
            return error
        }

}
const taxStatusExtractor = async ( id ) => {

    const instance = axios.create({
        baseURL:`${urlInit}taxpayers/${id}/tax-status`,
        headers
        });

        try {
            const { data } = await instance.get();
            
            return data['hydra:member'];
            
        } catch ( error ) {
            console.log(error);
            return error
        }

}
 


            
module.exports={
    getSatTopClients,
    getSatTopProv,
    getSatBancos, 
    invoiceExtraction,
    validateInvoiceExtraction,
    validateCredentials,
    balanceInsight,
    incomeInsight,
    metaDataInsight,
    financialRatios,
    taxStatusExtractor,
    financialRisks

}
            
            