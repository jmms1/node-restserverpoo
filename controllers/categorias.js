const { request, response } = require("express");
const { Categoria } = require('../models') 

const obtenerCategorias = async ( req= request, res=response ) => {

    const query = {estado: true};

    const {limite = 5, desde= 0} = req.query;

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .skip( Number(desde))
        .limit( Number(limite))
        .populate('usuario','nombre')
    ]); 

    res.json({
        total,
        categorias
    })

}

const obtenerCategoria = async ( req= request, res=response ) => {

    const { id } = req.params;

    const categoria = await Categoria.findById( id ).populate('usuario','nombre');

    if( !categoria.estado ) {
        return res.status(400).json({
            msg:'La categoría ha sido eliminada'
        })
    }

    res.json(categoria)
}

const crearCategoria = async ( req= request, res=response ) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya se encuentra registrada`
        });
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria =  new Categoria( data );

    await categoria.save();

    res.status(201).json( categoria );

}

const actualizarCategoria = async ( req= request, res=response ) => {

    const { id } = req.params;

    const nombre  = req.body.nombre.toUpperCase();
    const usuario = req.usuario._id;

    const categoriaAct = await Categoria.findByIdAndUpdate(id, {nombre, usuario}, {new:true});


    res.json({
        msg:`La categoria ha sido actualizada`,
        categoriaAct
    })

}

const borrarCategoria = async ( req= request, res=response ) => {

    const { id } = req.params;

    const catEliminada = await Categoria.findByIdAndUpdate(id, {estado:false}, {new : true});

    res.json({
        msg:'Categoria Eliminada',
        catEliminada
    })

}




module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}

