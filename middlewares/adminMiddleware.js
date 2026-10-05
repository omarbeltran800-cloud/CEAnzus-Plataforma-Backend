module.exports = (req, res, next) => {
    const userRole = req.user && req.user.role;

    if (userRole === 'ROLE_ADMIN') {
        return next();
    }

    return res.status(403).json({
        error: 'Acceso denegado. Se requiere el rol de Administrador (ROLE_ADMIN).'
    });
};
