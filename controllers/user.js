const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { searchOwnerId } = require('../helpers/hubspot-helper');



const usuariosGet = async (req=request, res = response) => {
    // const {q, nombre="No name", apikey} = req.query;
    const query= {estado: true};

    const {limite = 50 , desde = 0} = req.query;
    // const usuarios = await Usuario.find(query)
    // .skip(Number(desde))
    // .limit(Number(limite));
    // const total = await Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios 
    });
}

const usuarioGet = async (req=request, res = response) => {

    const { id } = req.params; 

    const {nombre, correo, hubspotId} = await Usuario.findById(id);

    res.json({nombre, correo, hubspotId});
}


const usuariosPost = async (req = request, res = response) => {

    const { nombre, correo, rol } = req.body;


    const usuario = new Usuario( {nombre, correo, rol} );

    let password = "distritopyme2022";


 
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt)





    await usuario.save();

    res.json(usuario);

}

const usuarioPasswordChange = async (req = request, res = response) => {

    const { password, id, correo  } = req.body;

    const salt = bcryptjs.genSaltSync();
    const encriptPassword = bcryptjs.hashSync(password, salt);
    
    const hubspotResponse = await searchOwnerId(correo);


    if( !hubspotResponse.data ){

        await Usuario.findByIdAndUpdate( id, {'password':encriptPassword, 'nuevo':false }, {new: true});

        return res.status(200).json({'msg':'No existe Id Hubspot'})


    }

    const { data } = hubspotResponse

    const { results } = data;

    let hubspotId; 

    
    if( results[0]){

        const respuestaHB = results[0]


        hubspotId = respuestaHB.id; 

    }else {

        hubspotId = null;

    }
    



    const nuevoUsuario = await Usuario.findByIdAndUpdate( id, {'password':encriptPassword, 'nuevo':false, hubspotId}, {new: true});

    res.json(nuevoUsuario);

}

const usuariosPut = async (req, res = response) => {
    
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    //Validar vs DB 
    if( password ){
        //Encriptar
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt); 

    }
    const usuario = await Usuario.findByIdAndUpdate( id, resto);
    
    res.json({
        msg: 'PUT  API- controlador',
        usuario
    })
}



const usuariosDelete = async (req, res = response) => {
   
   const { id } = req.params;
   
    const usuario = await Usuario.findByIdAndUpdate( id, {'estado': false}, {new:true});
   
    res.status(200).json( usuario );
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'PATCH API- controlador'
    })
}




  module.exports = {
      usuariosGet,
      usuarioGet,
      usuariosPost,
      usuariosPut,
      usuariosDelete,
      usuariosPatch,
      usuarioPasswordChange
      
  }