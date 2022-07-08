// CRUD PERSONAS 
const { request, response } = require("express");
const { getInfoBC, getInfoSAT } = require("../helpers/analisis");
const { ipLocation } = require("../helpers/geoapify");
const { getDeal, personaConstructorDB, createNote, associateNote } = require("../helpers/hubspot-helper");
const { validateInvoiceExtraction } = require("../helpers/satws-connect");
const { Persona } = require("../models");



const cargarPersona = async (req = request, res= response) => {

    const { id } = req.params;

    try {

        const props = await getDeal(id);
      
        const persona = personaConstructorDB(props);
        
        //IP Location 
        if(persona.solicitud.ip_del_solicitante){

            const personaLocation = await ipLocation(persona.solicitud.ip_del_solicitante, persona._id);         
        }

        if(persona.solicitud.buro.unykoo_id){
            
            const  personaSIC   = await getInfoBC(persona.solicitud.buro.unykoo_id, persona._id);
        }
        
        
        
        let rfc; 
        (persona.tipo_persona === 'P.Moral') ? (rfc = persona.solicitud.RFC_PM)  :  (rfc = persona.solicitud.RFC_PF)
        
        const numberOfExtractions = await validateInvoiceExtraction(rfc);
       
        if( persona.solicitud.facturacion.status_ciec === false || numberOfExtractions === 0 ){
            
            return res.status(201).json(persona)

        }
        
        const  personaSAT  = await getInfoSAT(rfc, persona._id);

        res.status( 201 ).json(
            personaSAT
        );

    } catch (error) {
        
        res.json(error);
    }

}

const getCards = async (req = request, res= response) => {

    const {etapa="pre-analisis"} = req.query;
 
    const query = { 'etapa': etapa };
    const options = 'solicitud.nombre_comercial solicitud.distrito_crm_id solicitud.monto_solicitado _id';

    try {

        const cards = await  Persona.find(query, options);


        res.json( cards );

    } catch (error) {

        res.json(error);
        
    }


}

const getPersona = async ( req= request, res= response ) => {

    const { id } = req.params;

    console.log(id);

    try {

        const persona = await Persona.findById(id).populate('consultasBC').populate('consultasFacturacion');

        res.json( persona );
        
    } catch (error) {

        res.json(error);
        
    }

}

const changePersonaStage = async (req= request, res= response) => {

    const { id } = req.params;
    const {etapa} = req.body;
  
    const personamodify = await Persona.findByIdAndUpdate(id, {etapa:etapa }, {new: true});

    res.status(200).json({personamodify});

}

const postNote = async ( req=request, res=response) => {

    const {noteForm, ownerNoteId, hubspotDealId, idDeal, idUsuario} = req.body;

    const nota = {
        nota:noteForm,
        date: new Date
    };
    
    const response = await createNote(noteForm, ownerNoteId);

    if( response.error ){
        return  res.status(400).json({'err':'Error al crear la nota'});
    }
       

    console.log(response.id);

    const {data:asosiationResponse} = await associateNote(response.id, hubspotDealId );

    if(asosiationResponse.error){
        return res.status(400).json({'err':'Error al asociar la nota'});
    }

    const personamodify = await Persona.findByIdAndUpdate(idDeal, { $push: { notas: nota  } }, {new: true});


    res.status(200).json({'msg':'Nota creada correctamente'});
}

module.exports={
    cargarPersona,
    getCards,
    getPersona,
    postNote,
    changePersonaStage
}