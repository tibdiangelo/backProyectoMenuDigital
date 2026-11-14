const express = require("express");
const router = express.Router();
const estadoControlador = require("../controllers/estado.pedido.controlador");

router.get("/", estadoControlador.obtenerEstados);
router.post("/", estadoControlador.crearEstado);
router.put("/:id", estadoControlador.actualizarEstado);
router.delete("/:id", estadoControlador.eliminarEstado);

module.exports = router;