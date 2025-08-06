// middleware/verificarRoles.js

export const verificarRoles = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const { rol, confirmado } = req.usuario || req.pasante || {};

    if (!rol) {
      return res.status(401).json({ msg: 'No autenticado' });
    }

    if (!confirmado) {
      return res.status(403).json({ msg: 'Cuenta no confirmada' });
    }

    if (!rolesPermitidos.includes(rol)) {
      return res.status(403).json({ msg: 'No tienes permiso para esta acción' });
    }

    next();
  };
};
