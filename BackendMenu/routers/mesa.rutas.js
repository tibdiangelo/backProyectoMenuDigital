const express = require('express');
const router = express.Router();
const mesaControlador = require('../controllers/mesa.controlador');
const { autenticar, autorizar } = require('../src/middlewares/auth.middleware');

// GET /api/mesas -> Ver todas las mesas (público)
router.get('/', mesaControlador.obtenerMesas);

// GET /api/mesas/:id -> Ver una sola mesa por su ID (público)
router.get('/:id', mesaControlador.obtenerMesaPorId);

// POST /api/mesas -> Crear una nueva mesa (solo admin)
router.post('/', autenticar, autorizar('admin'), mesaControlador.crearMesa);

// PUT /api/mesas/:id -> Actualizar una mesa (solo admin)
router.put('/:id', autenticar, autorizar('admin'), mesaControlador.actualizarMesa);

// DELETE /api/mesas/:id -> Eliminar una mesa (solo admin)
router.delete('/:id', autenticar, autorizar('admin'), mesaControlador.eliminarMesa);

module.exports = router;
