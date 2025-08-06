import Administrador from "../models/Administrador.js";
import Pasante from "../models/Pasante.js";
import { sendMailToRegister, sendMailToRecoveryPassword } from "../config/nodemailer.js";
import jwt from "jsonwebtoken";

// Login administrador
const loginAdministrador = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });

    const admin = await Administrador.findOne({ email });
    if (!admin)
      return res.status(404).json({ msg: "El correo no está registrado" });

    if (!admin.confirmEmail) {
      return res.status(403).json({ msg: "Debes confirmar tu cuenta por correo antes de iniciar sesión" });
    }


    const rolesPermitidos = ["administrador", "admini"];

    if (!rolesPermitidos.includes(admin.rol)) {
      return res.status(403).json({ msg: "No tienes permisos de administrador" });
    }


    const passwordValida = await admin.matchPassword(password);
    if (!passwordValida)
      return res.status(401).json({ msg: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: admin._id, rol: admin.rol },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      msg: "Bienvenido administrador",
      token,
      admin: {
        id: admin._id,
        nombre: admin.nombre,
        email: admin.email,
        rol: admin.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al iniciar sesión", error: error.message });
  }
};

// Cambiar contraseña administrador
const cambiarPasswordAdministrador = async (req, res) => {
  try {
    const { actualPassword, nuevaPassword } = req.body;

    if (!actualPassword || !nuevaPassword) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const admin = req.user;

    const passwordValida = await admin.matchPassword(actualPassword);
    if (!passwordValida) {
      return res.status(401).json({ msg: "La contraseña actual es incorrecta" });
    }

    admin.password = await admin.encrypPassword(nuevaPassword);
    await admin.save();

    res.status(200).json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({
      msg: "Error al cambiar la contraseña",
      error: error.message
    });
  }
};

const obtenerPerfilAdministrador = async (req, res) => {
  try {
    const admin = req.user; // ya lo cargaste en el middleware

    if (!admin) {
      return res.status(404).json({ msg: "Administrador no encontrado" });
    }

    // Retorna solo los campos deseados (sin password, etc.)
    const { _id, nombre, email, rol } = admin;
    res.status(200).json({ _id, nombre, email, rol });

  } catch (error) {
    res.status(500).json({ msg: "Error al obtener perfil de administrador" });
  }
};

const solicitarRecuperacionPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Administrador.findOne({ email });
    if (!admin) {
      return res.status(404).json({ msg: "Correo no encontrado" });
    }

    const token = crypto.randomUUID();
    admin.token = token;
    await admin.save();

    await sendMailToRecoveryPassword(admin.email, token); // Puedes usar otra función si necesitas un asunto diferente

    res.status(200).json({ msg: "Se ha enviado un correo para recuperar tu contraseña" });
  } catch (error) {
    res.status(500).json({ msg: "Error al solicitar recuperación", error: error.message });
  }
};

const recuperarPassword = async (req, res) => {
  const { token } = req.params;
  const { nuevaPassword } = req.body;

  try {
    const admin = await Administrador.findOne({ token });
    if (!admin) {
      return res.status(404).json({ msg: "Token no válido o expirado" });
    }

    admin.password = await admin.encrypPassword(nuevaPassword);
    admin.token = null; // invalidar token
    await admin.save();

    res.status(200).json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al restablecer contraseña", error: error.message });
  }
};


//Crear admin-rango menor
const crearAdmin = async (req, res) => {
  if (req.user.rol !== "administrador") {
    return res.status(403).json({ msg: "No tienes permiso para esta acción" });
  }

  // Extraer datos del body
  const { nombre, email, password, celular, rol } = req.body;

  // Verificar si el email ya existe
  const emailExiste = await Administrador.findOne({ email });
  if (emailExiste) {
    return res.status(400).json({ msg: "El correo ya está registrado" });
  }

  // Crear nuevo administrador
  const nuevoAdmin = new Administrador({
    nombre,
    email,
    password: await Administrador.prototype.encrypPassword(password),
    celular,
    rol: rol || "admini"
  });

  nuevoAdmin.token = nuevoAdmin.crearToken();

  await nuevoAdmin.save();
  sendMailToRegister(nuevoAdmin.email, nuevoAdmin.token);
  res.status(201).json({ msg: "Registro exitoso, ahora se debe verificar el correo ", email, admin: nuevoAdmin });
};

//Verifricar correo
const confirmarCuentaAdmini = async (req, res) => {
  const { token } = req.params;

  try {
    const admin = await Administrador.findOne({ token });


    if (!admin) {
      return res.status(400).json({ msg: "Token inválido o cuenta ya confirmada" });
    }

    admin.confirmEmail = true;
    admin.tokenVerificacion = null;
    await admin.save();

    res.status(200).json({ msg: "Cuenta confirmada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al confirmar la cuenta" });
  }
};

//Elimianr admini
const eliminarAdministrador = async (req, res) => {
  try {
    if (req.user.rol !== "administrador") {
      return res.status(403).json({ msg: "No tienes permiso para esta acción" });
    }

    const { id } = req.params;

    const adminAEliminar = await Administrador.findById(id);
    if (!adminAEliminar) {
      return res.status(404).json({ msg: "Administrador no encontrado" });
    }

    if (adminAEliminar.rol !== "admini") {
      return res.status(400).json({ msg: "Solo puedes eliminar cuentas de tipo Admini" });
    }

    if (req.user.id === id) {
      return res.status(400).json({ msg: "No puedes eliminarte a ti mismo" });
    }

    await adminAEliminar.deleteOne();
    return res.status(200).json({ msg: "Administrador eliminado correctamente" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error del servidor" });
  }
};

//listar adminis
const listarAdminis = async (req, res) => {
  try {
    // Verificamos que el usuario que consulta sea administrador
    if (req.user.rol !== "administrador") {
      return res.status(403).json({ msg: "No tienes permiso para ver esta información" });
    }

    const adminis = await Administrador.find({ rol: "admini" }).select("-password");

    res.status(200).json(adminis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los adminis" });
  }
};

// PASANTES
//Commit para hacer la documetnacion 
// Crear pasante
const crearPasante = async (req, res) => {
  try {
    const { nombre, email, facultad, celular, rol } = req.body;

    // Validar campos obligatorios
    if (!nombre || !email || !facultad || !celular) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    // Verificar que el email no esté registrado
    const emailExiste = await Pasante.findOne({ email });
    if (emailExiste) {
      return res.status(400).json({ msg: "El correo ya está registrado" });
    }

    // Crear token para confirmación
    const token = crypto.randomUUID(); // O tu helper crearToken()

    // Crear nuevo pasante
    const nuevoPasante = new Pasante({
      nombre,
      email,
      facultad,
      celular,
      rol: rol || "pasante",
      token,
      confirmEmail: false
    });

    // Guardar pasante
    await nuevoPasante.save();

    // Enviar correo de confirmación
    await sendMailToRegister(email, token);

    res.status(201).json({
      msg: "Pasante creado correctamente. Se ha enviado un correo de confirmación.",
      pasante: nuevoPasante
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear pasante", error: error.message });
  }
};

const confirmarPasante = async (req, res) => {
  try {
    const { token } = req.params;

    // Buscar pasante por token
    const pasante = await Pasante.findOne({ token });

    if (!pasante) {
      return res.status(404).json({ msg: "Token no válido o expirado" });
    }

    // Confirmar el email
    pasante.confirmEmail = true;
    pasante.token = null;

    await pasante.save();

    res.status(200).json({ msg: "Cuenta confirmada correctamente" });
  } catch (error) {
    res.status(500).json({
      msg: "Error al confirmar cuenta",
      error: error.message,
    });
  }
};

// Obtener todos los pasantes
const obtenerPasantes = async (req, res) => {
  try {
    const { search } = req.query;
    let filtro = {};
    if (search) {
      const regex = new RegExp(search, "i");
      filtro = { $or: [{ nombre: regex }, { email: regex }] };
    }
    const pasantes = await Pasante.find(filtro);
    res.status(200).json(pasantes);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener pasantes" });
  }
};

// Obtener pasante por id
const obtenerPasantePorId = async (req, res) => {
  try {
    const pasante = await Pasante.findById(req.params.id);
    if (!pasante) return res.status(404).json({ msg: "Pasante no encontrado" });
    res.status(200).json(pasante);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener pasante" });
  }
};

// Actualizar pasante
const actualizarPasante = async (req, res) => {
  try {
    const pasante = await Pasante.findById(req.params.id);
    if (!pasante) return res.status(404).json({ msg: "Pasante no encontrado" });

    const { nombre, email, password, facultad, celular } = req.body;

    pasante.nombre = nombre || pasante.nombre;
    pasante.email = email || pasante.email;
    pasante.facultad = facultad || pasante.facultad;
    pasante.celular = celular || pasante.celular;

    if (password) {
      pasante.password = await pasante.encrypPassword(password);
    }

    await pasante.save();
    res.status(200).json({ msg: "Pasante actualizado", pasante });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar pasante" });
  }
};

// Eliminar pasante
const eliminarPasante = async (req, res) => {
  try {
    const pasante = await Pasante.findById(req.params.id);
    if (!pasante) return res.status(404).json({ msg: "Pasante no encontrado" });

    await pasante.deleteOne();
    res.status(200).json({ msg: "Pasante eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar pasante" });
  }
};

export {
  loginAdministrador,
  cambiarPasswordAdministrador,
  obtenerPerfilAdministrador,
  solicitarRecuperacionPassword,
  recuperarPassword,
  eliminarAdministrador,
  listarAdminis,
  //Administrador
  crearAdmin,
  confirmarCuentaAdmini,
  // Pasantes
  crearPasante,
  obtenerPasantes,
  confirmarPasante,
  obtenerPasantePorId,
  actualizarPasante,
  eliminarPasante
};
