import jwt from "jsonwebtoken";
import Pasante from "../models/Pasante.js";

const verificarTokenPasante = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      msg: "No se proporcionó token de autenticación"
    });
  }

  try {
    const token = authorization.split(" ")[1];
    const { id } = jwt.verify(token, process.env.JWT_SECRET || 'secreto');

    const pasante = await Pasante.findById(id).select('-password -token');
    if (!pasante) {
      return res.status(404).json({ msg: "Pasante no encontrado" });
    }

    req.pasante = pasante; // queda disponible en el controlador
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
};

export default verificarTokenPasante;
