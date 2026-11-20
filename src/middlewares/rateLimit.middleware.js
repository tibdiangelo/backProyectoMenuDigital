const rateLimit = require('express-rate-limit');

function leerOrigenesPermitidos() {
    return String(process.env.ALLOWED_ORIGINS || '')
        .split(',')
        .map((origen) => origen.trim())
        .filter(Boolean);
}

const origenesPermitidos = leerOrigenesPermitidos();

const mensajeLimite = {
    error: 'Demasiadas solicitudes. Inténtalo de nuevo más tarde.'
};

function crearLimitador({ windowMs, limit, skipSuccessfulRequests = false }) {
    return rateLimit({
        windowMs,
        limit,
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests,
        message: mensajeLimite
    });
}

// GET públicos: 100 peticiones por minuto por IP.
const limitadorPublico = crearLimitador({
    windowMs: 60 * 1000,
    limit: 100
});

// Creación de pedidos: 30 por 15 minutos por IP.
const limitadorPedidos = crearLimitador({
    windowMs: 15 * 60 * 1000,
    limit: 30
});

// Login: 10 intentos fallidos por 15 minutos por IP.
const limitadorLogin = crearLimitador({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true
});

// Rechaza pedidos cuyo Origin no esté en ALLOWED_ORIGINS.
function validarOrigenPedido(req, res, next) {
    const origen = req.get('origin');

    if (!origen || !origenesPermitidos.includes(origen)) {
        return res.status(403).json({
            error: 'Origen no permitido para crear pedidos.'
        });
    }

    return next();
}

module.exports = {
    origenesPermitidos,
    limitadorPublico,
    limitadorPedidos,
    limitadorLogin,
    validarOrigenPedido
};
