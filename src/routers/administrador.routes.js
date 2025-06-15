import express from 'express';
import upload from '../middleware/upload.js'; // para manejo de archivos en exposiciones
import {
  crearPasante,
  obtenerPasantes,
  obtenerPasantePorId,
  actualizarPasante,
  eliminarPasante,
  crearExposicion,
  obtenerExposiciones,
  obtenerExposicionPorId,
  actualizarExposicion,
  eliminarExposicion
} from '../controllers/admin_controller.js';

const router = express.Router();

// Rutas PASANTES
router.post('/pasantes', crearPasante); // Crear pasante
router.get('/pasantes', obtenerPasantes); // Listar o buscar pasantes (?search=)
router.get('/pasantes/:id', obtenerPasantePorId); // Obtener pasante por ID
router.put('/pasantes/:id', actualizarPasante); // Actualizar pasante
router.delete('/pasantes/:id', eliminarPasante); // Eliminar pasante

// Rutas EXPOSICIONES
router.post(
  '/exposiciones',
  upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  crearExposicion
); // Crear exposición con archivos

router.get('/exposiciones', obtenerExposiciones); // Listar o buscar exposiciones (?search=)
router.get('/exposiciones/:id', obtenerExposicionPorId); // Obtener exposición por ID

router.put(
  '/exposiciones/:id',
  upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  actualizarExposicion
); // Actualizar exposición (puede incluir nuevos archivos)

router.delete('/exposiciones/:id', eliminarExposicion); // Eliminar exposición

export default router;