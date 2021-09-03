const Role = require("../models/role");
const Usuario = require("../models/usuario");


 const esRolValido = async (rol = '' ) => {

    const existeRol = await Role.findOne({rol});
        if( !existeRol ){
            throw new Error(`El rol ${rol} no esta registrado en DB`);
        }
}

const emailExiste = async ( correo = '') => {

    const emailDB = await Usuario.findOne({correo});
    if( emailDB ){
        throw new Error(`El email ${correo} ya se encuentra registrado`)
    }

}

const idExiste = async ( id ) => {

    const idDB = await Usuario.findById(id);

    if( !idDB ){
        throw new Error(`No existe usuario con este ID: ${id}`)
    }

}






module.exports={
    esRolValido,
    emailExiste,
    idExiste
}

// const existeEmail = await Usuario.findOne({ correo });
// if( existeEmail ){
//     return res.status(400).json({
//         msg: "El correo ya esta registrado"
//     })
// }