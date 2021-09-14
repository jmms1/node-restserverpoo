

const validarCampos  = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');
const categoriaDB = require('../middlewares/categoria-db');
const validarArchivo = require('../middlewares/validar-archivo');



module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
    ...categoriaDB,
    ...validarArchivo
}