const { Router } = require('express');
const { check } = require('express-validator');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const {validarCampos,validarJWT,esAdminRole,tieneRole } = require('../middlewares')


const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch, usuarioPasswordChange } = require('../controllers/user');
const { esRolValido, emailExiste, idExiste } = require('../helpers/db-validators');



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
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    // check('rol').custom( esRolValido ),
    validarCampos
] ,usuariosPost );


router.post('/password', [
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y mas de 8 caracteres').isLength( {min: 8} ),
    check('id').custom( idExiste ),
    validarCampos
] ,usuarioPasswordChange );

router.delete('/:id',[
    // validarJWT,
    // esAdminRole,
    // tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( idExiste ),
    validarCampos
], usuariosDelete );

router.patch('/', usuariosPatch );




module.exports = router;