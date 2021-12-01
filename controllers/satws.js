
const { response, request } = require("express");
const { getSatTopClients } = require("../helpers/satws-connect");



const getTopClients = async ( req = request, res = response, next ) => {

    const {  id } = req.params;
    
    const data = await getSatTopClients(id).catch(res.status(400));


    res.status(201).json( data );

    
}



module.exports = {
    getTopClients
}