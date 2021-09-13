const { response, request } = require("express");
const { Categoria } = require("../models");


const categoriaDb = async (req = request, res = response, next) => {

    const id = req.body.categoria;

    if(!id){
        return res.status(400).json({
            msg: `Es obligatorio proporcionar un id de categoria`
        })
    }

    const categoriaData = await Categoria.findById( id );

    if(!categoriaData){
        return res.status(400).json({
            msg: `El id: ${id} no es valido`
        })
    }
    
    req.categoria = categoriaData;

    next()

}

module.exports = {
    categoriaDb
}