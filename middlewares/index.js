

const validarCampos  = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');
const categoriaDB = require('../middlewares/categoria-db');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
    ...categoriaDB
}