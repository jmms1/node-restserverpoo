var { Router } = require('express');
const { mailPrueba, mailBienvenida } = require('../controllers/mail');




const router = Router();


router.post('/', mailPrueba );
router.post('/bienvenida/', mailBienvenida );




module.exports= router;