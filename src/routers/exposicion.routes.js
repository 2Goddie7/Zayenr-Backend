import express from 'express'
import upload from '../middleware/upload.js'

import {
  crearExposicion,
  obtenerExposiciones,
  obtenerExposicion,
  actualizarExposicion,
  eliminarExposicion
} from '../controllers/exposicion_controller.js'

const router = express.Router()

// Crear exposición con imagen y audio
router.post(
  '/crearExposicion',
  upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  crearExposicion
)//ok

// Obtener todas
router.get('/', obtenerExposiciones)//OK

// Obtener una por ID
router.get('/:id', obtenerExposicion)//OK

// Actualizar (puede traer nuevos archivos)
router.put(
  '/:id',
  upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  actualizarExposicion
)//OK

// Eliminar
router.delete('/:id', eliminarExposicion)//OK

export default router
