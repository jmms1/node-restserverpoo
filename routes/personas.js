var { Router } = require('express');
const { check } = require('express-validator');
const { cargarPersona, getCards, getPersona, postNote, changePersonaStage } = require('../controllers/personas');
const { validarCampos } = require('../middlewares');


const router = Router();


router.post('/crear/:id', cargarPersona );

router.get('/cards/', getCards );

router.get('/principal/:id', getPersona );

router.post('/notes/',[
    check('note', 'note required').not().isEmpty(),
    check('ownerNoteId', 'hubspot owner requiredr').not().isEmpty(),
    check('hubspotDealId', 'id deal required').not().isEmpty(),
    check('idDb', 'database id required').isMongoId(),
    validarCampos,
], postNote );

router.put('/etapa/:id',[
    check('etapa', 'info required').not().isEmpty(),
    check('id', 'id required').not().isEmpty(),
    validarCampos,
], changePersonaStage );








module.exports= router;