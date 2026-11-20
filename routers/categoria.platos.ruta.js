const express = require("express");
const router = express.Router();
const categoriaControlador = require("../controllers/categorias.platos.controlador");
const { autenticar, autorizar } = require("../src/middlewares/auth.middleware");
const { limitadorPublico } = require("../src/middlewares/rateLimit.middleware");

// GET /api/categorias -> Ver categorías (público, lo usa el menú)
router.get("/", limitadorPublico, categoriaControlador.obtenerCategorias);

// POST /api/categorias -> Crear categoría (solo admin)
router.post("/", autenticar, autorizar("admin"), categoriaControlador.crearCategoria);

// PUT /api/categorias/:id -> Actualizar categoría (solo admin)
router.put("/:id", autenticar, autorizar("admin"), categoriaControlador.actualizarCategoria);

// DELETE /api/categorias/:id -> Eliminar categoría (solo admin)
router.delete("/:id", autenticar, autorizar("admin"), categoriaControlador.eliminarCategoria);

module.exports = router;
