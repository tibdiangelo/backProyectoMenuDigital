const express = require('express');
const router = express.Router();
const usuarioControlador = require('../controllers/usuario.controlador');

// GET /api/usuarios -> Ver todos los usuarios
router.get('/', usuarioControlador.obtenerUsuarios);

// POST /api/usuarios/login -> Iniciar sesión
router.post('/login', usuarioControlador.iniciarSesion);

// GET /api/usuarios/:id -> Ver un usuario por ID
router.get('/:id', usuarioControlador.obtenerUsuarioPorId);

// POST /api/usuarios -> Crear un nuevo usuario
router.post('/', usuarioControlador.crearUsuario);

// PUT /api/usuarios/:id -> Actualizar un usuario
router.put('/:id', usuarioControlador.actualizarUsuario);

// DELETE /api/usuarios/:id -> Eliminar un usuario
router.delete('/:id', usuarioControlador.eliminarUsuario);

module.exports = router;