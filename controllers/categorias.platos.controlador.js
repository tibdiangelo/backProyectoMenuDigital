const categoriaServicio = require("../services/categorias.platos.servicio");

const LIMITE_POR_DEFECTO = 100;
const LIMITE_MAXIMO = 100;

function obtenerPaginacion(query = {}) {
    const paginaSolicitada = Number(query.page);
    const limiteSolicitado = Number(query.limit);
    const page = Number.isInteger(paginaSolicitada) && paginaSolicitada > 0
        ? paginaSolicitada
        : 1;
    const limit = Number.isInteger(limiteSolicitado) && limiteSolicitado > 0
        ? Math.min(limiteSolicitado, LIMITE_MAXIMO)
        : LIMITE_POR_DEFECTO;

    return {
        page,
        limit,
        from: (page - 1) * limit,
        to: page * limit - 1
    };
}

const obtenerCategorias = async (req, res) => {
    try {
        const paginacion = obtenerPaginacion(req.query);
        const { data, count } = await categoriaServicio.obtenerCategoriasServicio(paginacion);

        res.set('X-Total-Count', String(count ?? data.length));
        res.set('X-Page', String(paginacion.page));
        res.set('X-Limit', String(paginacion.limit));
        return res.status(200).json(data);
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