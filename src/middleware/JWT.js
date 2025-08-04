import jwt from "jsonwebtoken";
import Administrador from "../models/Administrador.js";

// generar token con id y rol
export const crearTokenJWT = (id, rol) => {
  return jwt.sign(
    { id, rol },
    process.env.JWT_SECRET || 'secreto',
    { expiresIn: "1d" }
  );
};

// verificar token de administrador
export const verificarTokenJWT = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      msg: "Aún no se te ha entregado un token o el que tienes es inválido"
    });
  }

  try {
    const token = authorization.split(" ")[1];
    const { id, rol } = jwt.verify(token, process.env.JWT_SECRET || 'secreto');

    if (rol !== "administrador" && rol !== "admini") {
      return res.status(403).json({ msg: "Acceso solo permitido a administradores" });
    }

    const admin = await Administrador.findById(id);
    if (!admin) {
      return res.status(404).json({ msg: "Administrador no encontrado" });
    }

    req.user = admin; // lo usas en controladores si necesitas info del admin
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token expirado o inválido" });
  }
};
