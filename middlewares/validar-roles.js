const { request, response } = require("express");



const esAdminRole = (req=request, res=response, next ) => {

    if( !req.usuario ){
        return res.status(500).json({
            msg: 'Se quiere verificar role sin datos'
        });
    }

    const { rol, nombre } = req.usuario;

    if( rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg:` ${nombre} no cuenta con permisos suficientes`
        })
    }


    next();


};

const tieneRole = ( ...roles ) => {


    return (req=request, res=response, next ) => {

        if( !req.usuario ){
            return res.status(500).json({
                msg: 'Se quiere verificar role sin datos'
            });
        }

        if( !roles.includes( req.usuario.rol ) ) {
            return res.status(401).json({
                msg: `El servicio requiere permisos: ${roles}`
            });
        }

        next();
    }





}

module.exports={
    esAdminRole,
    tieneRole
}