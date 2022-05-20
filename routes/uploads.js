const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImg, mostrarImagen, actImgCloud, serchprueba } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { searchOwnerId } = require('../helpers/hubspot-helper');
const { validarArchivo } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/',[
    validarArchivo,
    validarCampos
],cargarArchivo);

router.put('/:coleccion/:id',[
    validarArchivo,
    check('id', 'ID no es valido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'])),
    validarCampos
] ,actImgCloud);

router.get('/:coleccion/:id',[
    check('id', 'ID no es valido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'])),
    validarCampos
],mostrarImagen);

router.post('/prueba/',[], serchprueba)







module.exports= router;