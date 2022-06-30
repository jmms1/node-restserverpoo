var { Router } = require('express');
var { check } = require('express-validator');
const {invoiceExtract, validateRFC, prueba } = require('../controllers/satws');
const { validarCampos, validarRfc } = require('../middlewares');


const router = Router();


router.post('/:id/:idsat', [
    check('idsat').custom(validarRfc),
    check('id', 'No es in id valido').isMongoId(),
    validarCampos
], invoiceExtract);


router.put('/prueba/:id', [

], prueba );

router.get('/credential/:idsat', [
    check('idsat').custom(validarRfc),
    validarCampos
], validateRFC);




module.exports= router;






// router.get('/:id', [
//     check('id').custom(validarRfc),
//     validarCampos
// ], getInfo);