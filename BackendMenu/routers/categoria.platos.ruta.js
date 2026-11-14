const express = require("express");
const router = express.Router();
const categoriaControlador = require("../controllers/categorias.platos.controlador");

router.get("/", categoriaControlador.obtenerCategorias);
router.post("/", categoriaControlador.crearCategoria);
router.put("/:id", categoriaControlador.actualizarCategoria);
router.delete("/:id", categoriaControlador.eliminarCategoria);

module.exports = router;