const { Router } = require('express');
const { getAllMenu } = require('../controllers/menu.controller');

const router = Router();

// Ruta que toma la solicitud de los platos del menú y se la pasa al controlador
router.get('/', getAllMenu);

module.exports = router;