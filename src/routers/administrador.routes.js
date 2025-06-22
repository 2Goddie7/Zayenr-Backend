import express from 'express';
import upload from '../middleware/upload.js'; // para manejo de archivos en exposiciones
import {
  loginAdministrador,
  cambiarPasswordAdministrador,
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
} from '../controllers/administrador_controller.js';
import { verificarTokenJWT } from '../middleware/JWT.js';

const router = express.Router();

// Login administrador
router.post('/login', loginAdministrador);
// Cambiar contraseña
router.put('/cambiar-password', verificarTokenJWT, cambiarPasswordAdministrador);


// Rutas PASANTES
router.post('/pasantes', verificarTokenJWT, crearPasante);
router.get('/pasantes', verificarTokenJWT, obtenerPasantes);
router.get('/pasantes/:id', verificarTokenJWT, obtenerPasantePorId);
router.put('/pasantes/:id', verificarTokenJWT, actualizarPasante);
router.delete('/pasantes/:id', verificarTokenJWT, eliminarPasante);

// Rutas EXPOSICIONES
router.post('/exposiciones',
  verificarTokenJWT,
  upload.fields([{ name: 'imagen', maxCount: 1 }, { name: 'audio', maxCount: 1 }]),
  crearExposicion
); // Crear exposición con archivos

router.get('/exposiciones', verificarTokenJWT, obtenerExposiciones);
router.get('/exposiciones/:id', verificarTokenJWT, obtenerExposicionPorId);
router.put('/exposiciones/:id',
  verificarTokenJWT,
  upload.fields([{ name: 'imagen', maxCount: 1 }, { name: 'audio', maxCount: 1 }]),
  actualizarExposicion
);
router.delete('/exposiciones/:id', verificarTokenJWT, eliminarExposicion);

export default router;