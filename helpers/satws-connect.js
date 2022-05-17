const axios = require('axios');


//Parametros Generales
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


//Funciones 

const getSatTopClients = async (id) => {

    const instance = axios.create({
    baseURL:`https://api.satws.com/insights/${id}/customer-concentration`,
    headers,
    params
    })
        
    try{
        const { data } = await instance.get();
        console.log(data);
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
        baseURL:`https://api.satws.com/insights/${id}/supplier-concentration`,
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
        baseURL:`https://api.satws.com/insights/${id}/financial-institutions`,
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

const getResultadosDeclaracion = async (id) => {

    const instance = axios.create({
        baseURL:`https://api.satws.com/insights/${id}/income-statement`,
        headers,
        params
        });
        try {
            const { data } = await instance.get();
            // const gastosfinancieros = data.data.reduce((a, b) => a + (b['total'] || 0), 0);
            // const institucionesfinancieras =  data.data.map( data => {
            //     newdata = {};
            //     newdata.rfc = data.rfc;
            //     newdata.legalName = data.legalName;
            //     newdata.tradeName = data.tradeName;
            //     newdata.website = data.website; 
            //     newdata.sector = data.sector; 
            //     newdata.total = data.total; 
            //     let newtransactions = data.transactions.slice(-12);
            //     newdata.transactions = newtransactions;
            //     return newdata;
            // })
            
            console.log(data);
            return data;
            
        } catch (error) {
            console.log('Error',error);
            return error;
        }

}

const invoiceExtraction = async  (id) => {
    

    const baseURL = `https://api.satws.com/extractions`;
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

        console.log(response);

        return response.data;
        
    } catch (error) {

        return error.response; 
    }
    

}

const validateInvoiceExtraction = async (id) => {

    // https://api.satws.com/extractions/?taxpayer.id=DSD0103089Q7&extractor=invoice

    const instance = axios.create({
        baseURL:`https://api.satws.com/extractions/`,
        headers,
        params: {
            'taxpayer.id': id,
            'extractor': 'invoice'
        }
        });
        try {
            const { data } = await instance.get();
            return data['hydra:totalItems'];
            
        } catch (error) {
;
            return error;
        }

}

const validateCredentials = async (id) => {
    const instance = axios.create({
        baseURL:`https://api.satws.com/credentials/`,
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
 


            
module.exports={
    getSatTopClients,
    getSatTopProv,
    getSatBancos,
    getResultadosDeclaracion, 
    invoiceExtraction,
    validateInvoiceExtraction,
    validateCredentials
}
            
            