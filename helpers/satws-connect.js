const axios = require('axios');


const getSatTopClients = async (id) => {

    const rfc = id; 
    
        try{
    
            const instance = axios.create({
                baseURL:`https://api.satws.com/insights/${rfc}/invoicing-concentration`,
                headers: {
                    // 'X-API-Key': "fbaa373fc52acf3c115f82b045ad3ef9",
                    'X-API-Key': `${process.env.SATWS_APIKEY}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    'options[type]': "issued",
                    'options[from]': '2020-11-24'
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



module.exports={
    getSatTopClients
}


