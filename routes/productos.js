const { Router } = require('express');
const { check } = require('express-validator');
const { actualizarProducto, crearProducto, obtenerProductos, obtenerProducto, actCatDeProd, eliminarProducto } = require('../controllers/productos');
const { productoExiste, productoExisteID } = require('../helpers/db-validators');
const { validarJWT, validarCampos, categoriaDb, esAdminRole } = require('../middlewares');


const router = Router();

router.get('/', [], obtenerProductos);

router.get('/:id',[
    check('id', 'No es in ID valido').isMongoId(),
    check('id').custom(productoExisteID),
    validarCampos
], obtenerProducto);

router.post('/',[
    validarJWT,
    check('categoria').isMongoId(),
    validarCampos,
    categoriaDb,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre').custom(productoExiste),
    validarCampos
], crearProducto );

router.put('/:id',[
    validarJWT,
    check('id', 'No es in ID valido').isMongoId(),
    check('id').custom(productoExisteID),
    validarCampos
], actualizarProducto);

router.put('/categoria/:id',[
    validarJWT,
    check('id', 'No es in ID valido').isMongoId(),
    check('id').custom(productoExisteID),
    check('categoria', 'La categoria es obligatoria').notEmpty(),
    check('categoria').isMongoId(),
    validarCampos,
    categoriaDb,
    validarCampos
], actCatDeProd);

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es in ID valido').isMongoId(),
    check('id').custom(productoExisteID),
    validarCampos
],eliminarProducto);

module.exports= router;

