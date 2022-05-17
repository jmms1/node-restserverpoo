// CRUD PERSONAS 
const { request, response } = require("express");
const { getInfoBC, getInfoSAT } = require("../helpers/analisis");
const { getDeal, personaConstructorDB, createNote, associateNote } = require("../helpers/hubspot-helper");
const { validateInvoiceExtraction } = require("../helpers/satws-connect");
const { Persona } = require("../models");


const cargarPersona = async (req = request, res= response) => {

    const { id } = req.params;

    try {

        const props = await getDeal(id);
      
        const {persona} = personaConstructorDB(props);
        
        const {sic, personaSIC}  = await getInfoBC(persona.solicitud.buro.unykoo_id, persona._id);
        
        let rfc; 
        (persona.tipo_persona === 'P.Moral') ?   (rfc = persona.solicitud.RFC_PM)  :  (rfc = persona.solicitud.RFC_PF)
        
        const numberOfExtractions = await validateInvoiceExtraction(rfc);
        console.log(numberOfExtractions);
       
        if( persona.solicitud.facturacion.status_ciec === false || numberOfExtractions === 0 ){
            
            return res.status(201).json({sic, personaSIC})
        }
        
        const {newFacturacion, personaSAT} = await getInfoSAT(rfc, persona._id);

        res.status( 201 ).json({
            personaSAT,
            sic,
            newFacturacion
        });

    } catch (error) {
        
        res.json(error);
    }

}

const getCards = async (req = request, res= response) => {

    const query = { 'etapa': "pre-analisis" };
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

    const {note, ownerNoteId, hubspotDealId, idDb} = req.body;

    const nota = {
        nota:note,
        usuario:ownerNoteId
    };
    
    const response = await createNote(note, ownerNoteId).catch( res.status(400));

    console.log(response.id);

    const {data:asosiationResponse} = await associateNote(response.id, hubspotDealId ).catch( res.status(400));

    const personamodify = await Persona.findByIdAndUpdate(idDb, { $push: { notas: nota  } }, {new: true});


    res.status(200).json({response, asosiationResponse, personamodify});
}

module.exports={
    cargarPersona,
    getCards,
    getPersona,
    postNote,
    changePersonaStage
}