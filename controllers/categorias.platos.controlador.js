const categoriaServicio = require("../services/categorias.platos.servicio");

const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await categoriaServicio.obtenerCategoriasServicio();
        return res.status(200).json(categorias);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const crearCategoria = async (req, res) => {
    try {
        const { nombre, orden } = req.body;
        const nuevaCategoria = await categoriaServicio.crearCategoriaServicio(nombre, orden);
        return res.status(201).json({
            mensaje: "Categoría creada con éxito",
            categoria: nuevaCategoria
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, orden } = req.body;
        const categoriaActualizada = await categoriaServicio.actualizarCategoriaServicio(id, nombre, orden);
        return res.status(200).json({
            mensaje: "Categoría actualizada correctamente",
            categoria: categoriaActualizada
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        await categoriaServicio.eliminarCategoriaServicio(id);
        return res.status(200).json({
            mensaje: "Categoría eliminada correctamente"
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};