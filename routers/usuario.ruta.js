const express = require('express');
const router = express.Router();
const usuarioControlador = require('../controllers/usuario.controlador');
const { autenticar, autorizar } = require('../src/middlewares/auth.middleware');

// POST /api/usuarios/login -> Iniciar sesión (público)
router.post('/login', usuarioControlador.iniciarSesion);

// GET /api/usuarios -> Ver todos los usuarios (solo admin)
router.get('/', autenticar, autorizar('admin'), usuarioControlador.obtenerUsuarios);

// GET /api/usuarios/:id -> Ver un usuario por ID (solo admin)
router.get('/:id', autenticar, autorizar('admin'), usuarioControlador.obtenerUsuarioPorId);

// POST /api/usuarios -> Crear un chef (solo admin)
router.post('/', autenticar, autorizar('admin'), usuarioControlador.crearUsuario);

// PUT /api/usuarios/:id -> Actualizar un usuario (solo admin)
router.put('/:id', autenticar, autorizar('admin'), usuarioControlador.actualizarUsuario);

// DELETE /api/usuarios/:id -> Eliminar un usuario (solo admin)
router.delete('/:id', autenticar, autorizar('admin'), usuarioControlador.eliminarUsuario);

module.exports = router;
