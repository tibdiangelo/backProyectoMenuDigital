const usuarioServicio = require ('../services/usuario.servicio');


// Listar todos los usuarios
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioServicio.obtenerUsuariosDB();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un usuario por ID
const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await usuarioServicio.obtenerUsuarioPorIdDB(id);
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear usuario
const crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        const nuevoUsuario = await usuarioServicio.crearUsuarioDB(nombre, email, password, rol);
        res.status(201).json({ mensaje: "Usuario creado con éxito", data: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizar = req.body;
        const usuarioActualizado = await usuarioServicio.actualizarUsuarioDB(id, datosActualizar);
        res.status(200).json({ mensaje: "Usuario actualizado con éxito", data: usuarioActualizado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await usuarioServicio.eliminarUsuarioDB(id);
        res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};