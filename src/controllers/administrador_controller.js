import Administrador from '../models/Administrador.js';
import Pasante from '../models/Pasante.js';
import Exposicion from '../models/Exposicion.js';
import { deleteFileFromCloudinary } from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken';

// Login administrador
const loginAdministrador = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) 
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });

    const admin = await Administrador.findOne({ email });
    if (!admin) 
      return res.status(404).json({ msg: "El correo no está registrado" });

    if (admin.rol !== 'administrador') 
      return res.status(403).json({ msg: "No tienes permisos de administrador" });

    const passwordValida = await admin.matchPassword(password);
    if (!passwordValida) 
      return res.status(401).json({ msg: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      msg: "Bienvenido administrador",
      token,
      admin: {
        id: admin._id,
        nombre: admin.nombre,
        email: admin.email,
        rol: admin.rol
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al iniciar sesión", error: error.message });
  }
};

// Cambiar contraseña administrador
const cambiarPasswordAdministrador = async (req, res) => {
  try {
    const { id } = req.params; // ID del admin desde la URL
    const { actualPassword, nuevaPassword } = req.body;

    if (!actualPassword || !nuevaPassword) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const admin = await Administrador.findById(id);
    if (!admin) return res.status(404).json({ msg: "Administrador no encontrado" });

    if (admin.rol !== 'administrador') {
      return res.status(403).json({ msg: "No autorizado" });
    }

    const passwordValida = await admin.matchPassword(actualPassword);
    if (!passwordValida) {
      return res.status(401).json({ msg: "La contraseña actual es incorrecta" });
    }

    admin.password = await admin.encrypPassword(nuevaPassword);
    await admin.save();

    res.status(200).json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al cambiar la contraseña", error: error.message });
  }
};

// PASANTES

// Crear pasante
const crearPasante = async (req, res) => {
  try {
    const { nombre, email, password, facultad, celular, rol } = req.body;

    if (!nombre || !email || !password || !facultad || !celular) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const emailExiste = await Pasante.findOne({ email });
    if (emailExiste) {
      return res.status(400).json({ msg: "El correo ya está registrado" });
    }

    const nuevoPasante = new Pasante({
      nombre,
      email,
      password: await Pasante.prototype.encrypPassword(password),
      facultad,
      celular,
      rol: rol || 'pasante'
    });

    await nuevoPasante.save();
    res.status(201).json({ msg: "Pasante creado correctamente", pasante: nuevoPasante });
  } catch (error) {
    res.status(500).json({ msg: "Error al crear pasante", error: error.message });
  }
};

// Obtener todos los pasantes
const obtenerPasantes = async (req, res) => {
  try {
    const { search } = req.query;
    let filtro = {};
    if (search) {
      const regex = new RegExp(search, 'i');
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

    const { nombre, email, password, facultad, celular, rol } = req.body;

    pasante.nombre = nombre || pasante.nombre;
    pasante.email = email || pasante.email;
    pasante.facultad = facultad || pasante.facultad;
    pasante.celular = celular || pasante.celular;
    pasante.rol = rol || pasante.rol;

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

// EXPOSICIONES

// Crear exposicion
const crearExposicion = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    if (!req.files?.imagen || !req.files?.audio) {
      return res.status(400).json({ msg: "Debes subir una imagen y un audio" });
    }

    const imagen = req.files.imagen[0];
    const audio = req.files.audio[0];

    const nuevaExposicion = new Exposicion({
      nombre,
      descripcion,
      imagen: {
        url: imagen.path,
        public_id: imagen.filename
      },
      audio: {
        url: audio.path,
        public_id: audio.filename
      },
      creadoPor: req.user?.id || '68465dcebf8e27168b67c6a1'
    });

    await nuevaExposicion.save();
    res.status(201).json({ msg: "Exposición creada", exposicion: nuevaExposicion });
  } catch (error) {
    res.status(500).json({ msg: "Error al crear exposición", error: error.message });
  }
};

// Obtener exposiciones o buscar por nombre
const obtenerExposiciones = async (req, res) => {
  try {
    const { search } = req.query;
    let filtro = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      filtro = { nombre: regex };
    }
    const exposiciones = await Exposicion.find(filtro);
    res.status(200).json(exposiciones);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener exposiciones" });
  }
};

// Obtener exposición por id
const obtenerExposicionPorId = async (req, res) => {
  try {
    const exposicion = await Exposicion.findById(req.params.id);
    if (!exposicion) return res.status(404).json({ msg: "Exposición no encontrada" });
    res.status(200).json(exposicion);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener exposición" });
  }
};

// Actualizar exposición
const actualizarExposicion = async (req, res) => {
  try {
    const exposicion = await Exposicion.findById(req.params.id);
    if (!exposicion) return res.status(404).json({ msg: "Exposición no encontrada" });

    const { nombre, descripcion } = req.body;
    exposicion.nombre = nombre || exposicion.nombre;
    exposicion.descripcion = descripcion || exposicion.descripcion;

    if (req.files?.imagen) {
      await deleteFileFromCloudinary(exposicion.imagen.public_id);
      const nuevaImagen = req.files.imagen[0];
      exposicion.imagen = {
        url: nuevaImagen.path,
        public_id: nuevaImagen.filename
      };
    }

    if (req.files?.audio) {
      await deleteFileFromCloudinary(exposicion.audio.public_id);
      const nuevoAudio = req.files.audio[0];
      exposicion.audio = {
        url: nuevoAudio.path,
        public_id: nuevoAudio.filename
      };
    }

    await exposicion.save();
    res.status(200).json({ msg: "Exposición actualizada", exposicion });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar exposición" });
  }
};

// Eliminar exposición
const eliminarExposicion = async (req, res) => {
  try {
    const exposicion = await Exposicion.findById(req.params.id);
    if (!exposicion) return res.status(404).json({ msg: "Exposición no encontrada" });

    if (exposicion.imagen?.public_id) {
      await deleteFileFromCloudinary(exposicion.imagen.public_id, 'image');
    }

    if (exposicion.audio?.public_id) {
      await deleteFileFromCloudinary(exposicion.audio.public_id, 'raw');
    }

    await exposicion.deleteOne();
    res.status(200).json({ msg: "Exposición eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar exposición" });
  }
};

export {
  loginAdministrador,
  cambiarPasswordAdministrador,
  // Pasantes
  crearPasante,
  obtenerPasantes,
  obtenerPasantePorId,
  actualizarPasante,
  eliminarPasante,
  // Exposiciones
  crearExposicion,
  obtenerExposiciones,
  obtenerExposicionPorId,
  actualizarExposicion,
  eliminarExposicion
};