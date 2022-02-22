const axios = require('axios');


const getSatTopClients = async (id) => {

    const rfc = id; 

    const fecha = new Date();
    const añoActual = fecha.getFullYear()
    const nuevoAño = añoActual -1
    const mes = fecha.getMonth();
    const dia = fecha.getDay();
    
        try{
            const instance = axios.create({
                baseURL:`https://api.satws.com/insights/${rfc}/invoicing-concentration`,
                headers: {
                    'X-API-Key': `${process.env.SATWS_APIKEY}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    'options[type]': "issued",
                    'options[from]': `${nuevoAño}-${mes}-${dia}`
                    // '2020-11-24'
                }
            });
    
            const {data} = await instance.get();
            const clientes = data.map( data => ({
                name: data.name,
                total: data.total,
                share: data.share
            }));
    
            return clientes;
    
        } catch(error){
            console.log('Error',error);
            return error;
        }
}

const postZap = async (data) => {
    

    try {
        const instance2 = axios.create();

        const url = "https://hooks.zapier.com/hooks/catch/5767770/bmmeea8/";

        const postEstatus = await instance2.post(url,{data});

        console.log(postEstatus.status);
        return postEstatus.status;
        
    } catch (error) {
        console.log('Error',error);
        return error;
        
    }
    
}

const getClientsRFC = async (clientes=[], id) => { 

    const newClients = await Promise.all( clientes.map( async( {name, total, share} ) => {

        try {
            const instance = axios.create({
                baseURL:`https://api.satws.com/taxpayers/${id}/invoices?receiver.name=${name}`,
                headers: {
                    'X-API-Key': `${process.env.SATWS_APIKEY}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    'options[status]': "VIGENTE",
                    'options[order[amount]]': 'asc',
                    'options[itemsPerPage]': '1'
                }
            });
                    const res = await instance.get();
                
                    invoice = res.data['hydra:member'][0];
                    
                    return  {
                        name, 
                        total,
                        share,
                        rfc: invoice.receiver.rfc
                    }
    
            
        } catch (error) {
            return error
        }                

    }))

    return newClients;
     
}
    
            
module.exports={
    getSatTopClients,
    postZap,
    getClientsRFC
}
            
            