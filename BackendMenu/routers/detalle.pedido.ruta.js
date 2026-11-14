const express = require("express");
const router = express.Router();
const detalleControlador = require("../controllers/detalle.pedido.controlador");

router.get("/", detalleControlador.obtenerDetalles);
router.post("/", detalleControlador.crearDetalle);
router.put("/:id", detalleControlador.actualizarDetalle);
router.delete("/:id", detalleControlador.eliminarDetalle);

module.exports = router;