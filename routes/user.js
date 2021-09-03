const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/user');
const { esRolValido, emailExiste, idExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');



const router = Router();



router.get('/', usuariosGet);


router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( idExiste ),
    check('rol').custom( esRolValido ),
    validarCampos
] ,usuariosPut );


router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y mas de 6 caracteres').isLength( {min: 6} ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( esRolValido ),
    validarCampos
] ,usuariosPost );

router.delete('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( idExiste ),
    validarCampos
], usuariosDelete );

router.patch('/', usuariosPatch );




module.exports = router;