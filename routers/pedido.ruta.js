const express = require('express');
const router = express.Router();
const pedidoControlador = require('../controllers/pedido.controlador');
const { autenticar, autorizar } = require('../src/middlewares/auth.middleware');
const {
    limitadorPedidos,
    validarOrigenPedido
} = require('../src/middlewares/rateLimit.middleware');

// GET /api/pedidos -> Ver todos los pedidos (admin y chef)
router.get('/', autenticar, autorizar('admin', 'chef'), pedidoControlador.obtenerPedidos);

// GET /api/pedidos/:id -> Ver un pedido por ID (admin y chef)
router.get('/:id', autenticar, autorizar('admin', 'chef'), pedidoControlador.obtenerPedidoPorId);

// POST /api/pedidos -> Crear un nuevo pedido (público, lo usa el cliente)
router.post(
    '/',
    validarOrigenPedido,
    limitadorPedidos,
    pedidoControlador.validarDatosPedido,
    pedidoControlador.crearPedido
);

// POST /api/pedidos/completo -> Crear pedido + detalles en una transacción (público)
router.post(
    '/completo',
    validarOrigenPedido,
    limitadorPedidos,
    pedidoControlador.validarDatosPedido,
    pedidoControlador.crearPedidoCompleto
);

// PUT /api/pedidos/:id -> Actualizar un pedido o su estado (admin y chef)
router.put('/:id', autenticar, autorizar('admin', 'chef'), pedidoControlador.actualizarPedido);

// DELETE /api/pedidos/:id -> Eliminar un pedido (solo admin)
router.delete('/:id', autenticar, autorizar('admin'), pedidoControlador.eliminarPedido);

module.exports = router;
