const mesaServicio = require('../services/mesa.servicio');

// Listar todas las mesas
const obtenerMesas = async (req, res) => {
    try {
        const mesas = await mesaServicio.obtenerMesasDB();
        res.status(200).json(mesas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una mesa por ID
const obtenerMesaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const mesa = await mesaServicio.obtenerMesaPorIdDB(id);
        res.status(200).json(mesa);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear una mesa
const crearMesa = async (req, res) => {
    try {
        const { numero_mesa, capacidad, estado } = req.body;
        const nuevaMesa = await mesaServicio.crearMesaDB(numero_mesa, capacidad, estado);
        res.status(201).json({ mensaje: "Mesa creada con éxito", data: nuevaMesa });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar mesa
const actualizarMesa = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizar = req.body;
        const mesaActualizada = await mesaServicio.actualizarMesaDB(id, datosActualizar);
        res.status(200).json({ mensaje: "Mesa actualizada con éxito", data: mesaActualizada });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar mesa
const eliminarMesa = async (req, res) => {
    try {
        const { id } = req.params;
        await mesaServicio.eliminarMesaDB(id);
        res.status(200).json({ mensaje: "Mesa eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    obtenerMesas,
    obtenerMesaPorId,
    crearMesa,
    actualizarMesa,
    eliminarMesa
};