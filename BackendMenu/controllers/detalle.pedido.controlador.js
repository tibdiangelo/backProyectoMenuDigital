const detalleServicio = require("../services/detalle.pedido.servicio");

const obtenerDetalles = async (req, res) => {
    try {
        const detalles = await detalleServicio.obtenerDetallesServicio();
        return res.status(200).json(detalles);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const crearDetalle = async (req, res) => {
    try {
        const nuevoDetalle = await detalleServicio.crearDetalleServicio(req.body);
        return res.status(201).json({
            mensaje: "Detalle de pedido agregado con éxito",
            detalle: nuevoDetalle
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const actualizarDetalle = async (req, res) => {
    try {
        const { id } = req.params;
        const detalleActualizado = await detalleServicio.actualizarDetalleServicio(id, req.body);
        return res.status(200).json({
            mensaje: "Detalle de pedido actualizado correctamente",
            detalle: detalleActualizado
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const eliminarDetalle = async (req, res) => {
    try {
        const { id } = req.params;
        await detalleServicio.eliminarDetalleServicio(id);
        return res.status(200).json({
            mensaje: "Detalle de pedido eliminado correctamente"
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    obtenerDetalles,
    crearDetalle,
    actualizarDetalle,
    eliminarDetalle
};