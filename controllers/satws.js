
const { response, request } = require("express");
const { getInfoSAT } = require("../helpers/analisis");
const { ipLocation } = require("../helpers/geoapify");
const { invoiceExtraction, validateCredentials, balanceInsight } = require("../helpers/satws-connect");
const { timeout } = require("../helpers/timeoutFunctions");
const { Persona } = require("../models");



const invoiceExtract = async (req = request, res = response, next ) => {

    const {id, idsat} = req.params; 

    const {resp, number} = await validateCredentials(idsat);

    console.log(number);

    // Validar exclusion de status invalid resp?.status !== "valid"

    if( number === 0 ){
        await Persona.findByIdAndUpdate(id, {asyncTasks:{
            getFacturacion:{
                status: true,
                date: new Date,
                error: 'credencial no creada'
            }}
        });

        return res.status(204).json({status:'credencial no creada'});

    }

    const status = await invoiceExtraction(idsat);
    
    if (status?.status === 400){
        
        let response = {
            code: status.status,
            text: status.statusText
        }
        const personaerr = await Persona.findByIdAndUpdate(id, {asyncTasks:{
            getFacturacion:{
                status: true,
                date: new Date,
                error: status?.statusText
            }}
        });
        return  res.status(204).json({response, personaerr}) 
    };
    
    
    const personaAct = await Persona.findByIdAndUpdate(id, {asyncTasks:{
        getFacturacion:{
            status: true,
            date: new Date
        }}});
        if( personaAct )
        
        await timeout(900000);
        
        const personaSat = await getInfoSAT(idsat,id).catch(res.status(400));
        
        
        res.status(200).json( {status, personaSat} ); 
        
}


const validateRFC = async (req = request, res = response, next) => {

    const {idsat} = req.params

    const response = await validateCredentials(idsat).catch(res.status(400));

    res.status(200).json(response);

}

const prueba = async (req = request, res = response, next) => {

    const {id} = req.params

    const csf = await ipLocation(id).catch(res.status(400));

    console.log(csf)
    
    res.status(200).json(csf);

}





module.exports = {
    invoiceExtract,
    validateRFC, 
    prueba
}

