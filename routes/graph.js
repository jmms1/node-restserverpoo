var { Router } = require('express');
const { check } = require('express-validator');
const {  altaBrokerSP, test } = require('../controllers/graph');
const { validarCampos } = require('../middlewares');



const router = Router();


router.post('/:correo',[
    check('correo', 'El correo debe ser valido').isEmail(),
    check('correo', 'El correo es Obligatorio').not().isEmpty(),
    validarCampos
], altaBrokerSP );

router.get('/test', test);




module.exports= router;

