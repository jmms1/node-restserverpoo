var { Router } = require('express');
var { check } = require('express-validator');
const { getTopClients, getTopClientsRFC } = require('../controllers/satws');
const { validarCampos, validarRfc } = require('../middlewares');


const router = Router();

router.get('/:id', [
    check('id').custom(validarRfc),
    validarCampos
], getTopClients);


// router.get('/:id', [
//     check('id').custom(validarRfc),
//     validarCampos
// ], getTopClientsRFC);



module.exports= router;

