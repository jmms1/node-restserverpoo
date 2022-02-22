const { request, response } = require("express");
const { categoriaExiste, productoExiste } = require("../helpers/db-validators");
const { pruebaArchivo } = require("../helpers/formatoDrip");
const { Producto, Categoria } = require("../models");



const obtenerProductos = async ( req= request, res=response ) => {

    const query = {estado: true};

    const {limite = 5, desde= 0} = req.query;

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .skip( Number(desde))
        .limit(Number(limite))
        .populate('usuario', 'nombre')
        .populate('categoria','nombre')
    ]);

    res.json({
        total,
        productos
    })    
}

const obtenerProducto = async ( req= request, res=response ) => {

    const { id } = req.params;

    let valor = pruebaArchivo;
    console.log(valor);

    const producto = await Producto.findById( id ).populate('usuario', 'nombre').populate('categoria', 'nombre');

    if( !producto.estado ){
        return res.status(400).json({
            msg:'El producto ha sido eliminado'
        })
    }

    res.json( producto );

}

const crearProducto = async ( req= request, res=response ) => {

    const { estado, _id, usuario, ...resto} = req.body;

    resto.nombre = resto.nombre.toUpperCase();
    resto.usuario = req.usuario._id;
    resto.categoria = req.categoria._id;
    
    const producto =  new Producto ( resto );

    await producto.save();

    res.status(200).json( producto );

}


const actualizarProducto = async ( req= request, res=response ) => {

    const { id } = req.params;
    const {estado, _id, usuario, categoria, ...resto}  = req.body;
    resto.usuario = req.usuario._id;        

    if(resto.nombre){
        resto.nombre = resto.nombre.toUpperCase();
        const nombreDb = await productoExiste(resto.nombre, false)

        if(nombreDb){
            return res.status(400).json({
                msg:'El nombre del producto ya existe'
            })
        }
    }

    const productoAct = await Producto.findByIdAndUpdate(id, resto, {new: true});

    res.json({
        msg:'El producto se ha actualizado',
        productoAct
    })
}

const actCatDeProd = async ( req= request, res=response ) =>{

    const { id } = req.params;

    const categoria = req.categoria._id;
    const usuario = req.usuario._id;

    let data = {
        categoria,
        usuario
    }
    const productoAct = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json({
        msg:'El producto se ha actualizado',
        productoAct
    })

}

const eliminarProducto = async ( req= request, res=response ) => {

    const { id } = req.params;

    const productoElim = await Producto.findByIdAndUpdate(id, {estado:false}, {new:true});

    res.json({
        msg:'Producto Eliminado',
        productoElim
    })


}



module.exports= {
    obtenerProducto,
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    actCatDeProd
}