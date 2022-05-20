const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');
const { searchOwnerId } = require('../helpers/hubspot-helper');



const usuariosGet = async (req=request, res = response) => {
    // const {q, nombre="No name", apikey} = req.query;
    const query= {estado: true};

    const {limite = 15 , desde = 0} = req.query;
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


const usuariosPost = async (req = request, res = response) => {

    const { nombre, correo, rol } = req.body;


    const usuario = new Usuario( {nombre, correo, rol} );

    let password = "holamundo";

    console.log(password);
 
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt)

    console.log(usuario);



    await usuario.save();

    res.json(usuario);

}

const usuarioPasswordChange = async (req = request, res = response) => {

    const { password, id, correo  } = req.body;

    const salt = bcryptjs.genSaltSync();
    const encriptPassword = bcryptjs.hashSync(password, salt);
    
    const { data } = await searchOwnerId(correo);
    const { results } = data;


    console.log(results);

    let hubspotId; 

    
    if( results[0]){

        const respuestaHB = results[0]

        console.log(respuestaHB);
        console.log(respuestaHB.id);

        hubspotId = respuestaHB.id; 

    }else {

        hubspotId = null;

    }
    
    console.log(hubspotId);

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
   
    //Eliminar
//    const usuario = await Usuario.findByIdAndDelete( id );
    const usuario = await   Usuario.findByIdAndUpdate( id, {estado: false});
   
    res.json( usuario );
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'PATCH API- controlador'
    })
}




  module.exports = {
      usuariosGet,
      usuariosPost,
      usuariosPut,
      usuariosDelete,
      usuariosPatch,
      usuarioPasswordChange
      
  }