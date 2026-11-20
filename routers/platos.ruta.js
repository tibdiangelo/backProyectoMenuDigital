const express = require('express');
const router = express.Router();
const platosControlador = require('../controllers/platos.controlador');
const { autenticar, autorizar } = require('../src/middlewares/auth.middleware');
const { limitadorPublico } = require('../src/middlewares/rateLimit.middleware');

// GET /api/platos -> Ver todos (público, lo usa el menú)
router.get('/', limitadorPublico, platosControlador.obtenerPlatos);

// GET /api/platos/:id -> Ver uno solo por ID (público)
router.get('/:id', limitadorPublico, platosControlador.obtenerPlatoPorId);

// POST /api/platos -> Crear un nuevo plato (solo admin)
router.post('/', autenticar, autorizar('admin'), platosControlador.crearPlato);

// PUT /api/platos/:id -> Actualizar un plato (solo admin)
router.put('/:id', autenticar, autorizar('admin'), platosControlador.actualizarPlato);

// DELETE /api/platos/:id -> Borrar un plato (solo admin)
router.delete('/:id', autenticar, autorizar('admin'), platosControlador.eliminarPlato);

module.exports = router
