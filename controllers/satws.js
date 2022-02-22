
const { response, request } = require("express");
const { getSatTopClients, postZap, getClientsRFC } = require("../helpers/satws-connect");



const getTopClients = async ( req = request, res = response, next ) => {

    const {  id } = req.params;
    
    const data = await getSatTopClients(id).catch(res.status(400));

    const datacomplete = await getClientsRFC( data, id);


    const ok = await postZap(datacomplete).catch(res.status(400));

    console.log(ok);


    res.status(201).json( datacomplete );


    
}


const getTopClientsRFC = async ( req = request, res = response, next ) => {

    const {  id } = req.params;
    
    const data = await getSatTopClients(id).catch(res.status(400));

    const datacomplete = await getClientsRFC( data, id);

    res.status(201).json( datacomplete );    
}



module.exports = {
    getTopClients,
    getTopClientsRFC
}