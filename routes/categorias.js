const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { categoriaExiste, catNombreExiste } = require('../helpers/db-validators');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const router = Router();

router.get('/',[],obtenerCategorias );

router.get('/:id',[
    check('id','No es un ID Valido').isMongoId(),
    check('id').custom(categoriaExiste),
    validarCampos
],obtenerCategoria);

router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').notEmpty(),
    validarCampos
] ,crearCategoria);

router.put('/:id',[
    validarJWT,
    check('id','No es un ID Valido').isMongoId(),
    check('id').custom(categoriaExiste),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre').custom(catNombreExiste),
    validarCampos
], actualizarCategoria );

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un ID Valido').isMongoId(),
    check('id').custom(categoriaExiste),
    validarCampos
],borrarCategoria);




module.exports= router;