var { Router } = require('express');
const { check } = require('express-validator');
const { cargarPersona, getCards, getPersona, postNote, changePersonaStage, searchDeals, postNoteDB } = require('../controllers/personas');
const { validarCampos, validarJWT } = require('../middlewares');


const router = Router();


router.post('/crear/:id', cargarPersona );

router.get('/cards/', getCards );

router.get('/search/', searchDeals );

router.get('/principal/:id', getPersona );

router.post('/notes/',[
    check('noteForm', 'note required').not().isEmpty(),
    check('ownerNoteId', 'hubspot owner requiredr').not().isEmpty(),
    check('hubspotDealId', 'id deal required').not().isEmpty(),
    check('idDeal', 'database id deal required').isMongoId(),
    check('idUsuario', 'database id user required').isMongoId(),
    validarCampos,
], postNote );

router.post('/notesdb/',[
    check('noteForm', 'note required').not().isEmpty(),
    check('idDeal', 'database id deal required').isMongoId(),
    check('idUsuario', 'database id user required').isMongoId(),
    validarCampos,
], postNoteDB );

router.put('/etapa/:id',[
    check('etapa', 'info required').not().isEmpty(),
    check('id', 'id required').not().isEmpty(),
    validarCampos,
], changePersonaStage );

router.get('userid/:id', [], )








module.exports= router;