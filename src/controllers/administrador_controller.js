import Pasante from '../models/Pasante.js';
import Exposicion from '../models/Exposicion.js';
import { deleteFileFromCloudinary } from '../utils/cloudinary.js';

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

// Obtener todos los pasantes o buscar por nombre o email (query params)
const obtenerPasantes = async (req, res) => {
  try {
    const { search } = req.query;
    let filtro = {};
    if (search) {
      const regex = new RegExp(search, 'i'); // insensible a mayúsculas
      filtro = { $or: [{ nombre: regex }, { email: regex }] };
    }
    const pasantes = await Pasante.find(filtro);
    res.status(200).json(pasantes);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener pasantes" });
  }
};

// Obtener pasante por ID
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

// Crear exposición
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

// Obtener exposiciones o buscar por nombre (query param)
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

// Obtener exposición por ID
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
