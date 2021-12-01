var { Router } = require('express');
var { check } = require('express-validator');
const { getTopClients } = require('../controllers/satws');
const { validarCampos, validarRfc } = require('../middlewares');


const router = Router();

router.get('/:id', [
    check('id').custom(validarRfc),
    validarCampos
], getTopClients);






module.exports= router;

