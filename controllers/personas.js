// CRUD PERSONAS 
const { request, response } = require("express");
const { getInfoBC, getInfoSAT } = require("../helpers/analisis");
const { ipLocation } = require("../helpers/geoapify");
const { getDeal, personaConstructorDB, createNote, associateNote, searchOwnerId } = require("../helpers/hubspot-helper");
const { validateInvoiceExtraction } = require("../helpers/satws-connect");
const { Persona } = require("../models");



const cargarPersona = async (req = request, res= response) => {

    const { id } = req.params;

    try {

        const props = await getDeal(id);
      
        const persona = personaConstructorDB(props);


        if( persona.solicitud.ip_del_solicitante ){
            let ip = await ipLocation(persona.solicitud.ip_del_solicitante, persona._id);
            
        }

        if(persona.solicitud.buro.unykoo_id){
            let bc = await getInfoBC(persona.solicitud.buro.unykoo_id, persona._id);
        }

        
        let rfc; 
        (persona.tipo_persona === 'P.Moral') ? (rfc = persona.solicitud.RFC_PM)  :  (rfc = persona.solicitud.RFC_PF)
        
        const numberOfExtractions = await validateInvoiceExtraction(rfc);
       
        if( persona.solicitud.facturacion.status_ciec === false || numberOfExtractions.items === 0 || numberOfExtractions?.member[0].status === 'failed') {
            let {_id} = persona;
            return res.status( 201 ).json(
                {'msg': ` BC Creado existosamente con id ${_id}`}
            );
            
        }
        
        const  personaSAT  = await getInfoSAT(rfc, persona._id);

        const {_id} = personaSAT;

        res.status( 201 ).json(
            {'msg': `BC y SAT Creado existosamente con id ${_id}`}
        );
        console.log(personaSAT);    
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
const searchDeals = async (req = request, res= response) => {

    const {property, searchVariable} = req.query;

    const query = [
        {
          '$search': {
            'index': 'dealSearch', 
            'text': {
              'query': `${searchVariable}`, 
              'path': {
                'wildcard': '*'
              },
              'fuzzy': {}
            }
          }
        }, {
          '$project': {
            'solicitud.nombre_comercial': 1, 
            'solicitud.distrito_crm_id': 1, 
            'solicitud.monto_solicitado _id': 1, 
            'etapa': 1
          }
        }, {
            '$limit': 5
        }
      ];

  
    try {

        let cards = await Persona.aggregate(query);

        // if(cards === [] ){
        //     let newcards = await Persona.find({ 'solicitud.distrito_crm_id': searchVariable},'solicitud.nombre_comercial solicitud.distrito_crm_id solicitud.monto_solicitado _id etapa');
        //     if( newcard) { cards = newcards}

        // }

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

        if(persona.solicitud.propietarios_hs){
            const {firstName, lastName, email} = await searchOwnerId(persona.solicitud.propietarios_hs);
            const ownerInfo = {firstName, lastName, email};


            return res.json({persona, ownerInfo});

        }
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
        note:noteForm,
        date: new Date,
        usuario: idUsuario
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

const postNoteDB = async ( req=request, res=response ) => {

    const {noteForm, idDeal, idUsuario} = req.body;

    const nota = {
        note:noteForm,
        date: new Date,
        usuario: idUsuario
    };

    const personamodify = await Persona.findByIdAndUpdate(idDeal, { $push: { notas: nota  } }, {new: true});


    res.status(200).json({'msg':'Nota creada correctamente en la base de datos de Analyzer'});

}

const getHubspotUserById = async ( req=request, res=response) => {

    const { id } = req.params;

}

module.exports={
    cargarPersona,
    getCards,
    getPersona,
    postNote,
    changePersonaStage,
    searchDeals,
    postNoteDB
}