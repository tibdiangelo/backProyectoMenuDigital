const usuarioService = require("../services/usuario.servicio");

const listar = async (req, res) => {
    try {
        const usuarios = await usuarioService.getAllUsers();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || "Error al obtener los usuarios" });
    }
};

const obtener = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.getUser(id);
        res.status(200).json(usuario);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || "Error al obtener el usuario" });
    }
};

const crear = async (req, res) => {
    try {
        const { nombre, email, password, rol_id } = req.body;
        
        if (!nombre || !email || !password) {
            return res.status(400).json({ error: "El nombre, el email y la contraseña son obligatorios" });
        }

        const nuevoUsuario = await usuarioService.createUser({ 
            nombre, 
            email, 
            password, 
            rol_id 
        });
        
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || "Error al crear el usuario" });
    }
};

const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const datos = req.body;
        const usuarioActualizado = await usuarioService.updateUser(id, datos);
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || "Error al actualizar el usuario" });
    }
};

const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await usuarioService.deleteUser(id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || "Error al eliminar el usuario" });
    }
};

module.exports = { listar, obtener, crear, actualizar, eliminar };