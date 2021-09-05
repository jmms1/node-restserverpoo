const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");




const login = async  (req, res= response) => {

    const {correo, password } = req.body;

    try {
        //Verificar correo existe
        const usuario = await Usuario.findOne( {correo} );
        if( !usuario ){
            return res.status(400).json({
                msg:'Usuario / Passsword no son correctos -correo'
            });
        }
        //Verificar usuario activo
        if( !usuario.estado ){
            return res.status(400).json({
                msg:'Usuario / Passsword no son correctos -estado false'
            });
        }
        //Validar Contraseña
        const validPassword = bcryptjs.compareSync( password , usuario.password );
        if( !validPassword ){
            return res.status(400).json({
                msg:'Usuario / Passsword no son correctos -password'
            });
        }
        //Generar JWT 
        const token = await generarJWT( usuario. id );

        res.json({
            msg: 'Login ok',
            usuario,
            token
        })

        
    } catch (error) {
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
        
    }


}


module.exports = {
    login
}