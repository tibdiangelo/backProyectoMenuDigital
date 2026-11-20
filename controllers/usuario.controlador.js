const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioServicio = require('../services/usuario.servicio');
const { JWT_SECRET } = require('../src/middlewares/auth.middleware');

const ROL_CHEF = 3;
const LONGITUD_MINIMA_PASSWORD = 8;
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizarRol(rolId) {
    return Number(rolId) === ROL_CHEF ? 'chef' : 'admin';
}

function usuarioSeguro(usuario) {
    return {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: normalizarRol(usuario.rol_id),
        rol_id: usuario.rol_id,
        debe_cambiar_password: Boolean(usuario.debe_cambiar_password)
    };
}

function validarDatosUsuario({ nombre, email, password }) {
    if (!nombre || !String(nombre).trim()) {
        return 'El nombre es obligatorio.';
    }

    if (String(nombre).trim().length < 2) {
        return 'El nombre debe tener al menos 2 caracteres.';
    }

    if (!email || !String(email).trim()) {
        return 'El correo es obligatorio.';
    }

    if (!CORREO_VALIDO.test(String(email).trim())) {
        return 'El correo no tiene un formato válido.';
    }

    if (!password) {
        return 'La contraseña es obligatoria.';
    }

    if (String(password).length < LONGITUD_MINIMA_PASSWORD) {
        return `La contraseña debe tener al menos ${LONGITUD_MINIMA_PASSWORD} caracteres.`;
    }

    return null;
}

// Listar todos los usuarios (sin contraseñas)
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioServicio.obtenerUsuariosDB();
        res.status(200).json(usuarios.map(usuarioSeguro));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un usuario por ID (sin contraseña)
const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await usuarioServicio.obtenerUsuarioPorIdDB(id);
        res.status(200).json(usuarioSeguro(usuario));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear usuario. Solo un admin llega aquí y el rol se asigna como chef.
const crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const errorValidacion = validarDatosUsuario({ nombre, email, password });

        if (errorValidacion) {
            return res.status(400).json({ error: errorValidacion });
        }

        const nombreLimpio = String(nombre).trim();
        const emailLimpio = String(email).trim().toLowerCase();
        const usuarios = await usuarioServicio.obtenerUsuariosDB();

        const repetido = usuarios.find(
            (item) =>
                String(item.email ?? '').toLowerCase() === emailLimpio ||
                String(item.nombre ?? '').toLowerCase() ===
                    nombreLimpio.toLowerCase()
        );

        if (repetido) {
            return res.status(409).json({
                error: 'Ya existe un usuario con ese correo o nombre.'
            });
        }

        const passwordHasheada = await bcrypt.hash(String(password), 10);
        const nuevoUsuario = await usuarioServicio.crearUsuarioDB(
            nombreLimpio,
            emailLimpio,
            passwordHasheada,
            ROL_CHEF
        );

        return res.status(201).json({
            mensaje: 'Chef creado con éxito',
            data: usuarioSeguro(nuevoUsuario)
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Actualizar usuario. Si cambia la contraseña, se guarda hasheada.
const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const camposActualizados = { ...req.body };

        if (camposActualizados.password) {
            if (String(camposActualizados.password).length < LONGITUD_MINIMA_PASSWORD) {
                return res.status(400).json({
                    error: `La contraseña debe tener al menos ${LONGITUD_MINIMA_PASSWORD} caracteres.`
                });
            }

            camposActualizados.password = await bcrypt.hash(
                String(camposActualizados.password),
                10
            );
        }

        if (camposActualizados.rol) {
            camposActualizados.rol_id = camposActualizados.rol;
            delete camposActualizados.rol;
        }

        const usuarioActualizado = await usuarioServicio.actualizarUsuarioDB(
            id,
            camposActualizados
        );

        return res.status(200).json({
            mensaje: 'Usuario actualizado con éxito',
            data: usuarioSeguro(usuarioActualizado)
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await usuarioServicio.eliminarUsuarioDB(id);
        res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Iniciar sesión con correo o nombre + contraseña hasheada
const iniciarSesion = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'Usuario/correo y contraseña son obligatorios.'
            });
        }

        const identificador = String(username).trim().toLowerCase();
        const usuarios = await usuarioServicio.obtenerUsuariosDB();

        const usuario = usuarios.find(
            (item) =>
                String(item.email ?? '').toLowerCase() === identificador ||
                String(item.nombre ?? '').toLowerCase() === identificador
        );

        if (!usuario) {
            return res.status(401).json({
                error: 'Usuario o contraseña incorrectos.'
            });
        }

        const coincide = await bcrypt.compare(
            String(password),
            String(usuario.password ?? '')
        );

        if (!coincide) {
            return res.status(401).json({
                error: 'Usuario o contraseña incorrectos.'
            });
        }

        const rol = normalizarRol(usuario.rol_id);
        const token = jwt.sign(
            {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol,
                debe_cambiar_password: Boolean(usuario.debe_cambiar_password)
            },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.status(200).json({
            mensaje: 'Sesión iniciada correctamente',
            token,
            usuario: usuarioSeguro(usuario)
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Cambiar la contraseña del usuario autenticado y habilitar el resto de rutas
const cambiarPassword = async (req, res) => {
    try {
        const { password_actual, password_nueva } = req.body ?? {};

        if (!password_actual || !password_nueva) {
            return res.status(400).json({
                error: 'La contraseña actual y la nueva son obligatorias.'
            });
        }

        if (String(password_nueva).length < LONGITUD_MINIMA_PASSWORD) {
            return res.status(400).json({
                error: `La contraseña debe tener al menos ${LONGITUD_MINIMA_PASSWORD} caracteres.`
            });
        }

        const usuario = await usuarioServicio.obtenerUsuarioPorIdDB(
            req.usuario.id
        );

        const coincideActual = await bcrypt.compare(
            String(password_actual),
            String(usuario.password ?? '')
        );

        if (!coincideActual) {
            return res.status(400).json({
                error: 'La contraseña actual es incorrecta.'
            });
        }

        const esMismaPassword = await bcrypt.compare(
            String(password_nueva),
            String(usuario.password ?? '')
        );

        if (esMismaPassword) {
            return res.status(400).json({
                error: 'La nueva contraseña debe ser diferente de la actual.'
            });
        }

        const passwordHasheada = await bcrypt.hash(
            String(password_nueva),
            10
        );

        const usuarioActualizado = await usuarioServicio.actualizarUsuarioDB(
            usuario.id,
            {
                password: passwordHasheada,
                debe_cambiar_password: false
            }
        );

        const rol = normalizarRol(usuarioActualizado.rol_id);
        const token = jwt.sign(
            {
                id: usuarioActualizado.id,
                nombre: usuarioActualizado.nombre,
                email: usuarioActualizado.email,
                rol,
                debe_cambiar_password: false
            },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.status(200).json({
            mensaje: 'Contraseña actualizada correctamente',
            token,
            usuario: usuarioSeguro(usuarioActualizado)
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    iniciarSesion,
    cambiarPassword
};