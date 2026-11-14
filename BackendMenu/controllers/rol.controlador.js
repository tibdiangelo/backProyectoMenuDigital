const rolServicio = require("../services/rol.servicio");

const obtenerRoles = async (req, res) => {
    try {
        const roles = await rolServicio.obtenerRolesServicio();
        return res.status(200).json(roles);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const crearRol = async (req, res) => {
    try {
        const nuevoRol = await rolServicio.crearRolServicio(req.body);
        return res.status(201).json({
            mensaje: "Rol creado con éxito",
            rol: nuevoRol
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const actualizarRol = async (req, res) => {
    try {
        const { id } = req.params;
        const rolActualizado = await rolServicio.actualizarRolServicio(id, req.body);
        return res.status(200).json({
            mensaje: "Rol actualizado correctamente",
            rol: rolActualizado
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const eliminarRol = async (req, res) => {
    try {
        const { id } = req.params;
        await rolServicio.eliminarRolServicio(id);
        return res.status(200).json({
            mensaje: "Rol eliminado correctamente"
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    obtenerRoles,
    crearRol,
    actualizarRol,
    eliminarRol
};