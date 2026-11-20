const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || !JWT_SECRET.trim()) {
    throw new Error(
        'Falta la variable de entorno JWT_SECRET. Defínela en el archivo .env antes de iniciar el servidor.'
    );
}

function responderNoAutorizado(res, mensaje) {
    return res.status(401).json({ error: mensaje });
}

// Verifica el token JWT enviado en el header Authorization
function autenticar(req, res, next) {
    const encabezado = req.headers.authorization || '';
    const [tipo, token] = encabezado.split(' ');

    if (tipo !== 'Bearer' || !token) {
        return responderNoAutorizado(
            res,
            'Debes iniciar sesión para realizar esta acción.'
        );
    }

    try {
        req.usuario = jwt.verify(token, JWT_SECRET);
        return next();
    } catch {
        return responderNoAutorizado(
            res,
            'Tu sesión expiró. Inicia sesión de nuevo.'
        );
    }
}

// Permite solo los roles indicados. Debe usarse después de autenticar.
function autorizar(...rolesPermitidos) {
    return (req, res, next) => {
        if (!req.usuario) {
            return responderNoAutorizado(
                res,
                'Debes iniciar sesión para realizar esta acción.'
            );
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({
                error: 'No tienes permisos para realizar esta acción.'
            });
        }

        return next();
    };
}

module.exports = {
    autenticar,
    autorizar,
    JWT_SECRET
};
