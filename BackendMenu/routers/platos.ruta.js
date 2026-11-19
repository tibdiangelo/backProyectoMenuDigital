const express = require('express');
const router = express.Router();
const platosControlador = require('../controllers/platos.controlador');
const {
  authMiddleware,
  requireRole,
} = require('../src/middlewares/auth.middleware');

// GET /api/platos -> Ver todos (público)
router.get('/', platosControlador.obtenerPlatos);

// GET /api/platos/:id -> Ver uno solo por ID (público)
router.get('/:id', platosControlador.obtenerPlatoPorId);

// POST /api/platos -> Crear un nuevo plato (solo administrador)
router.post(
  '/',
  authMiddleware,
  requireRole('administrador'),
  platosControlador.crearPlato
);

// PUT /api/platos/:id -> Actualizar un plato (solo administrador)
router.put(
  '/:id',
  authMiddleware,
  requireRole('administrador'),
  platosControlador.actualizarPlato
);

// DELETE /api/platos/:id -> Borrar un plato (solo administrador)
router.delete(
  '/:id',
  authMiddleware,
  requireRole('administrador'),
  platosControlador.eliminarPlato
);

module.exports = router;