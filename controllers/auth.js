const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");




const login = async  (req, res= response) => {

    const {correo, password } = req.body;



    try {
        //Verificar correo existe
        const usuario = await Usuario.findOne( {correo} );
        if( !usuario ){
            return res.status(400).json({
                msg:'Usuario / Passsword no son correctos o no existen'
            });
        }
        //Verificar usuario activo
        if( !usuario.estado ){
            return res.status(400).json({
                msg:'Usuario / Passsword no son correctos'
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
        const token = await generarJWT( usuario._id );

        res.json({
            msg: 'Login Successful',
            usuario,
            token
        })

        
    } catch (error) {
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
        
    }


}

const googleSignin = async (req = request , res = response) => {

    const {id_token} = req.body;
    
    try {

        const {email, nombre, img } =  await googleVerify( id_token );

        let usuario = await Usuario.findOne({email});

        if( !usuario ) {
            //crear
            const data = {
                nombre,
                email,
                password: ':X',
                img,
                google: true
            };

            usuario = new Usuario( data )
            await usuario.save();
        }
        // Usuario en DB 
        if( !usuario.estado ) {
            return res.status(401).json({
                msg:'Usuario bloqueado contacte administrador'
            })
        }
        //Generar JWT 

        const token = await generarJWT( usuario. id );
        
        res.json({
            usuario,
            token
        })

    } catch (error) {

        res.status(400).json({
            msg: 'Token no fue validado'
        })
        
    }





}


module.exports = {
    login,
    googleSignin
}