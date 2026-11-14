const express = require('express');
const router = express.Router();
const mesaControlador = require('../controllers/mesa.controlador');

// GET /api/mesas -> Ver todas las mesas
router.get('/', mesaControlador.obtenerMesas);

// GET /api/mesas/:id -> Ver una sola mesa por su ID
router.get('/:id', mesaControlador.obtenerMesaPorId);

// POST /api/mesas -> Crear una nueva mesa
router.post('/', mesaControlador.crearMesa);

// PUT /api/mesas/:id -> Actualizar una mesa (como su estado)
router.put('/:id', mesaControlador.actualizarMesa);

// DELETE /api/mesas/:id -> Eliminar una mesa
router.delete('/:id', mesaControlador.eliminarMesa);

module.exports = router;