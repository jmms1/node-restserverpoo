const { Categoria, Producto } = require("../models");
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

const categoriaExiste = async ( id ) => {

    const categoriaDB = await Categoria.findById(id);

    if ( !categoriaDB ) {
        throw new Error(`No existe categoría con el ID: ${id}`)
    }
}

const catNombreExiste = async ( nombre ) => {

    nomMayus = nombre.trim().toUpperCase();

    const catNomDB = await Categoria.findOne({nombre:nomMayus});

    if ( catNomDB ) {
        throw new Error(`El nombre de la categoria : ${nomMayus} ya se encuentra registrado`)
    }
}

const productoExiste = async ( nombre, mdw = true ) => {

    const nombreMayus = nombre.toUpperCase();

    const productoDB = await Producto.findOne( {nombre:nombreMayus} );

    if( productoDB ){
        if( mdw ){
        throw new Error( `El producto: ${nombre} ya se encuentra registrado` )
        } else {
            return true; 
        }
    }
}

const productoExisteID = async ( id ) => {

    productoDB = await Producto.findById(id);

    if( !productoDB ){
        throw new Error(`El producto con ID: ${id} no se encuentra en la base de datos`) 
    }

} 

const coleccionesPermitidas = (coleccion = '', colecciones = [] ) => {
    
    const incluida = colecciones.includes( coleccion );

    if( !incluida ){
        throw new Error( `La coleccion ${coleccion}, no es permitida, ${colecciones}`)
    }
    return true; 
}





module.exports={
    esRolValido,
    emailExiste,
    idExiste,
    categoriaExiste,
    catNombreExiste,
    productoExiste,
    productoExisteID,
    coleccionesPermitidas
}

// const existeEmail = await Usuario.findOne({ correo });
// if( existeEmail ){
//     return res.status(400).json({
//         msg: "El correo ya esta registrado"
//     })
// }