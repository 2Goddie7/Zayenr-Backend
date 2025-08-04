export function estaAutenticado(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ msg: "No estás autenticado con Microsoft" });
}
