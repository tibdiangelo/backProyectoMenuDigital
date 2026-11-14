const express = require('express');
const router = express.Router();
const platosControlador = require('../controllers/platos.controlador');

// GET /api/platos -> Ver todos
router.get('/', platosControlador.obtenerPlatos);

// GET /api/platos/:id -> Ver uno solo por ID
router.get('/:id', platosControlador.obtenerPlatoPorId);

// POST /api/platos -> Crear un nuevo plato
router.post('/', platosControlador.crearPlato);

// PUT /api/platos/:id -> Actualizar un plato
router.put('/:id', platosControlador.actualizarPlato);

// DELETE /api/platos/:id -> Borrar un plato
router.delete('/:id', platosControlador.eliminarPlato);

module.exports = router