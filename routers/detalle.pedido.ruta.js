const express = require("express");
const router = express.Router();
const detalleControlador = require("../controllers/detalle.pedido.controlador");
const { autenticar, autorizar } = require("../src/middlewares/auth.middleware");

// GET /api/detalles -> Ver detalles (admin y chef)
router.get("/", autenticar, autorizar("admin", "chef"), detalleControlador.obtenerDetalles);

// POST /api/detalles -> Crear detalle de pedido (público, lo usa el cliente)
router.post("/", detalleControlador.crearDetalle);

// PUT /api/detalles/:id -> Actualizar detalle (solo admin)
router.put("/:id", autenticar, autorizar("admin"), detalleControlador.actualizarDetalle);

// DELETE /api/detalles/:id -> Eliminar detalle (solo admin)
router.delete("/:id", autenticar, autorizar("admin"), detalleControlador.eliminarDetalle);

module.exports = router;
