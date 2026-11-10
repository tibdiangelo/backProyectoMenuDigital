const { Router } = require('express');
const { getAllMenu } = require('../controller/menu.controller');

const router = Router();

// Ruta que toma la solicitud de los platos del menú y se la pasa al controlador
router.get('/', getAllMenu);

module.exports = router;
