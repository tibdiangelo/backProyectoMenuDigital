const express = require("express");
const router = express.Router();
const estadoControlador = require("../controllers/estado.pedido.controlador");
const { autenticar, autorizar } = require("../src/middlewares/auth.middleware");

// GET /api/estados -> Ver estados (público)
router.get("/", estadoControlador.obtenerEstados);

// POST /api/estados -> Crear estado (solo admin)
router.post("/", autenticar, autorizar("admin"), estadoControlador.crearEstado);

// PUT /api/estados/:id -> Actualizar estado (solo admin)
router.put("/:id", autenticar, autorizar("admin"), estadoControlador.actualizarEstado);

// DELETE /api/estados/:id -> Eliminar estado (solo admin)
router.delete("/:id", autenticar, autorizar("admin"), estadoControlador.eliminarEstado);

module.exports = router;
