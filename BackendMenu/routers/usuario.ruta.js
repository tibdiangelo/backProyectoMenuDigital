const express = require('express');
const router = express.Router();
const usuarioControlador = require('../controllers/usuario.controlador');
const {
  authMiddleware,
  requireRole,
} = require('../src/middlewares/auth.middleware');

// GET /api/usuarios -> Ver todos los usuarios
router.get('/', authMiddleware, usuarioControlador.obtenerUsuarios);

// GET /api/usuarios/:id -> Ver un usuario por ID
router.get('/:id', authMiddleware, usuarioControlador.obtenerUsuarioPorId);

// POST /api/usuarios -> Crear un nuevo usuario
router.post(
  '/',
  authMiddleware,
  requireRole('administrador'),
  usuarioControlador.crearUsuario
);

// PUT /api/usuarios/:id -> Actualizar un usuario
router.put('/:id', authMiddleware, usuarioControlador.actualizarUsuario);

// DELETE /api/usuarios/:id -> Eliminar un usuario
router.delete(
  '/:id',
  authMiddleware,
  requireRole('administrador'),
  usuarioControlador.eliminarUsuario
);

module.exports = router;