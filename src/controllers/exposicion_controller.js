import Exposicion from '../models/Exposicion.js';
import { deleteFileFromCloudinary } from '../utils/cloudinary.js';

const crearExposicion = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre || !descripcion) {
            return res.status(400).json({ msg: "Todos los campos son obligatorios" });
        }

        console.log('REQ FILES:', req.files);
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
            creadoPor: req.user?.id
        });

        await nuevaExposicion.save();
        res.status(201).json(nuevaExposicion);
    } catch (error) {
        console.error("Error al crear exposición:", error);
        res.status(500).json({
            msg: "Error al crear la exposición",
            error: error.message,
            stack: error.stack
        });
    }
};



const obtenerExposiciones = async (req, res) => {
    try {
        const exposiciones = await Exposicion.find();
        res.status(200).json(exposiciones);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener las exposiciones" });
    }
};

const obtenerExposicion = async (req, res) => {
    try {
        const exposicion = await Exposicion.findById(req.params.id);
        if (!exposicion) return res.status(404).json({ msg: "Exposición no encontrada" });

        res.status(200).json(exposicion);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener la exposición" });
    }
};

const actualizarExposicion = async (req, res) => {
    try {
        const exposicion = await Exposicion.findById(req.params.id)
        if (!exposicion) return res.status(404).json({ msg: "Exposición no encontrada" })

        const { nombre, descripcion } = req.body
        exposicion.nombre = nombre || exposicion.nombre
        exposicion.descripcion = descripcion || exposicion.descripcion

        if (req.files?.imagen) {

            await deleteFileFromCloudinary(exposicion.imagen.public_id)

            const nuevaImagen = req.files.imagen[0]
            exposicion.imagen = {
                url: nuevaImagen.path,
                public_id: nuevaImagen.filename
            }
        }

        if (req.files?.audio) {
            await deleteFileFromCloudinary(exposicion.audio.public_id)

            const nuevoAudio = req.files.audio[0]
            exposicion.audio = {
                url: nuevoAudio.path,
                public_id: nuevoAudio.filename
            }
        }

        await exposicion.save()
        res.status(200).json(exposicion)

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Error al actualizar la exposición" })
    }
}

const eliminarExposicion = async (req, res) => {
    try {
        const exposicion = await Exposicion.findById(req.params.id)
        if (!exposicion) return res.status(404).json({ msg: "Exposición no encontrada" })

        if (exposicion.imagen?.public_id) {
            await deleteFileFromCloudinary(exposicion.imagen.public_id, 'image')
        }

        if (exposicion.audio?.public_id) {
            await deleteFileFromCloudinary(exposicion.audio.public_id, 'raw')
        }
        await exposicion.deleteOne()
        res.status(200).json({ msg: "Exposición eliminada correctamente" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Error al eliminar la exposición" })
    }
}

const obtenerExposicionPublica = async (req, res) => {
  try {
    const { id } = req.params;
    const exposicion = await Exposicion.findById(id);

    if (!exposicion) {
      return res.status(404).json({ msg: "Exposición no encontrada" });
    }

    res.status(200).json({
      nombre: exposicion.nombre,
      descripcion: exposicion.descripcion,
      imagen: exposicion.imagen?.url,
      audio: exposicion.audio?.url
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener la exposición pública" });
  }
};


export {
    crearExposicion,
    obtenerExposiciones,
    obtenerExposicion,
    actualizarExposicion,
    eliminarExposicion,
    obtenerExposicionPublica
};
