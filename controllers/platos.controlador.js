const platoServicio = require('../services/platos.servicio');

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

// Listar todos (paginado)
const obtenerPlatos = async (req, res) => {
    try {
        const paginacion = obtenerPaginacion(req.query);
        const { data, count } = await platoServicio.obtenerPlatosDB(paginacion);

        res.set('X-Total-Count', String(count ?? data.length));
        res.set('X-Page', String(paginacion.page));
        res.set('X-Limit', String(paginacion.limit));
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener solo uno por ID
const obtenerPlatoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const plato = await platoServicio.obtenerPlatoPorIdDB(id);
        res.status(200).json(plato);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear plato
const crearPlato = async (req, res) => {
    try {
        const { nombre, precio, imagen, disponible, categoria_id } = req.body;
        const descripcion = req.body['descripción'] ?? req.body.descripcion ?? '';
        const nuevoPlato = await platoServicio.crearPlatoDB({
            nombre,
            'descripción': descripcion,
            precio,
            imagen,
            disponible,
            categoria_id
        });
        res.status(201).json({ mensaje: "Plato creado con éxito", data: nuevoPlato });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar plato
const actualizarPlato = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizar = req.body;
        const platoActualizado = await platoServicio.actualizarPlatoDB(id, datosActualizar);
        res.status(200).json({ mensaje: "Plato actualizado con éxito", data: platoActualizado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar plato
const eliminarPlato = async (req, res) => {
    try {
        const { id } = req.params;
        await platoServicio.eliminarPlatoDB(id);
        res.status(200).json({ mensaje: "Plato eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    obtenerPlatos,
    obtenerPlatoPorId,
    crearPlato,
    actualizarPlato,
    eliminarPlato
};