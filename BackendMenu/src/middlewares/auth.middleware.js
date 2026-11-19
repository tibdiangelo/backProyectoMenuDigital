const supabase = require('../../services/supabaseClient');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token de autenticación requerido (formato: Bearer <token>)',
      });
    }

    const token = authHeader.split(' ')[1]?.trim();

    if (!token) {
      return res.status(401).json({
        error: 'Token vacío o mal formado',
      });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        error: 'Token inválido o sesión expirada',
      });
    }

    req.user = data.user;
    req.token = token;
    return next();
  } catch (err) {
    return res.status(500).json({
      error: 'Error al verificar la autenticación',
    });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const role =
      req.user?.app_metadata?.role ||
      req.user?.user_metadata?.role ||
      req.user?.role;

    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({
        error: 'No tienes permisos para realizar esta acción',
      });
    }

    return next();
  };
}

module.exports = {
  authMiddleware,
  requireRole,
};