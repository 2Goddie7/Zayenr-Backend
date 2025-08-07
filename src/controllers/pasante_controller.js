import Pasante from '../models/Pasante.js'
import { sendMailToRegister } from "../config/nodemailer.js"
import generarJWT from '../helpers/crearJWT.js'

//Actualizar foto pasante
const actualizarPerfilPasante = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, facultad, celular, fotoPerfil } = req.body;

  try {
    const pasante = await Pasante.findById(id);
    if (!pasante) {
      return res.status(404).json({ msg: "Pasante no encontrado" });
    }

    pasante.nombre = nombre ?? pasante.nombre;
    pasante.email = email ?? pasante.email;
    pasante.facultad = facultad ?? pasante.facultad;
    pasante.celular = celular ?? pasante.celular;
    pasante.fotoPerfil = fotoPerfil ?? pasante.fotoPerfil;

    await pasante.save();

    res.status(200).json({ msg: "Perfil actualizado correctamente", pasante });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar el perfil" });
  }
};

// Confirmar email del pasante
const confirmarMail = async (req, res) => {
  const { token } = req.params
  const pasante = await Pasante.findOne({ token })

  if (!pasante?.token) {
    return res.status(404).json({ msg: "La cuenta ya ha sido confirmada o el token es inválido" })
  }

  pasante.token = null
  pasante.confirmEmail = true
  await pasante.save()

  res.status(200).json({ msg: "Cuenta confirmada correctamente" })
}


// Obtener perfil del pasante por ID
const obtenerPerfilPasante = async (req, res) => {
  try {
    const { id } = req.params;

    const pasante = await Pasante.findById(id);

    if (!pasante) {
      return res.status(404).json({ msg: "Pasante no encontrado" });
    }

    res.status(200).json(pasante);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener el perfil del pasante" });
  }
};


export {
  confirmarMail,
  obtenerPerfilPasante,
  actualizarPerfilPasante
}
