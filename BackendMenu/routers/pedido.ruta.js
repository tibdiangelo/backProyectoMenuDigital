const express = require('express');
const router = express.Router();
const pedidoControlador = require('../controllers/pedido.controlador');

// GET /api/pedidos -> Ver todos los pedidos
router.get('/', pedidoControlador.obtenerPedidos);

// GET /api/pedidos/:id -> Ver un pedido por ID
router.get('/:id', pedidoControlador.obtenerPedidoPorId);

// POST /api/pedidos -> Crear un nuevo pedido
router.post('/', pedidoControlador.crearPedido);

// PUT /api/pedidos/:id -> Actualizar un pedido
router.put('/:id', pedidoControlador.actualizarPedido);

// DELETE /api/pedidos/:id -> Eliminar un pedido
router.delete('/:id', pedidoControlador.eliminarPedido);

module.exports = router;