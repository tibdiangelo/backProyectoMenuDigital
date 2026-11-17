const express = require("express");
const router = express.Router();
const rolControlador = require("../controllers/rol.controlador");
const { autenticar, autorizar } = require("../src/middlewares/auth.middleware");

// GET /api/rol -> Ver roles (solo admin)
router.get("/", autenticar, autorizar("admin"), rolControlador.obtenerRoles);

// POST /api/rol -> Crear rol (solo admin)
router.post("/", autenticar, autorizar("admin"), rolControlador.crearRol);

// PUT /api/rol/:id -> Actualizar rol (solo admin)
router.put("/:id", autenticar, autorizar("admin"), rolControlador.actualizarRol);

// DELETE /api/rol/:id -> Eliminar rol (solo admin)
router.delete("/:id", autenticar, autorizar("admin"), rolControlador.eliminarRol);

module.exports = router;
