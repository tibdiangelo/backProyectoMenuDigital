const express = require('express');
const router = express.Router();
const usuarioControlador = require('../controllers/usuario.controlador');
const {
  authMiddleware,
  requireRole,
} = require('../src/middlewares/auth.middleware');

// GET /api/usuarios -> Listar todos los usuarios (solo administrador)
router.get(
  '/',
  authMiddleware,
  requireRole('administrador'),
  usuarioControlador.obtenerUsuarios
);

// GET /api/usuarios/:id -> Obtener usuario por ID (autenticado)
router.get('/:id', authMiddleware, usuarioControlador.obtenerUsuarioPorId);

// POST /api/usuarios -> Crear usuario (solo administrador)
router.post(
  '/',
  authMiddleware,
  requireRole('administrador'),
  usuarioControlador.crearUsuario
);

// PUT /api/usuarios/:id -> Actualizar usuario (solo administrador)
router.put(
  '/:id',
  authMiddleware,
  requireRole('administrador'),
  usuarioControlador.actualizarUsuario
);

// DELETE /api/usuarios/:id -> Eliminar usuario (solo administrador)
router.delete(
  '/:id',
  authMiddleware,
  requireRole('administrador'),
  usuarioControlador.eliminarUsuario
);

module.exports = router;