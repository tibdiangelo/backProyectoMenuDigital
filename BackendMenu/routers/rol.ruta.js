const express = require("express");
const router = express.Router();
const rolControlador = require("../controllers/rol.controlador");

router.get("/", rolControlador.obtenerRoles);
router.post("/", rolControlador.crearRol);
router.put("/:id", rolControlador.actualizarRol);
router.delete("/:id", rolControlador.eliminarRol);

module.exports = router;