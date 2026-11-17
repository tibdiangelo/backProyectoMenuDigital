const platoServicio = require('../services/platos.servicio');

// Listar todos
const obtenerPlatos = async (req, res) => {
    try {
        const platos = await platoServicio.obtenerPlatosDB();
        res.status(200).json(platos);
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