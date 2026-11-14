const estadoServicio = require("../services/estado.pedido.servicio");

const obtenerEstados = async (req, res) => {
    try {
        const estados = await estadoServicio.obtenerEstadosServicio();
        return res.status(200).json(estados);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const crearEstado = async (req, res) => {
    try {
        const nuevoEstado = await estadoServicio.crearEstadoServicio(req.body);
        return res.status(201).json({
            mensaje: "Estado de pedido creado con éxito",
            estado: nuevoEstado
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const estadoActualizado = await estadoServicio.actualizarEstadoServicio(id, req.body);
        return res.status(200).json({
            mensaje: "Estado de pedido actualizado correctamente",
            estado: estadoActualizado
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const eliminarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        await estadoServicio.eliminarEstadoServicio(id);
        return res.status(200).json({
            mensaje: "Estado de pedido eliminado correctamente"
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    obtenerEstados,
    crearEstado,
    actualizarEstado,
    eliminarEstado
};