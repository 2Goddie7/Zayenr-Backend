// exposicion.routes.js
import express from 'express'
import upload from '../middleware/upload.js'

import {
  crearExposicion,
  obtenerExposiciones,
  obtenerExposicion,
  actualizarExposicion,
  eliminarExposicion,
  obtenerExposicionPublica
} from '../controllers/exposicion_controller.js'

import { verificarTokenJWT } from '../middleware/JWT.js'
import  verificarTokenPasante  from '../middleware/verificarTokenPasante.js'
import { verificarRoles } from '../middleware/verificarRoles.js'

const router = express.Router()

// ✅ Crear exposición: permitido a admin, admini, pasante
router.post(
  '/crearExposicion',
  (req, res, next) => {
    // Determina si es pasante o admin
    const token = req.headers.authorization?.split(' ')[1]
    if (token?.startsWith('pas_')) {
      verificarTokenPasante(req, res, next)
    } else {
      verificarTokenJWT(req, res, next)
    }
  },
  verificarRoles(['admin', 'admini', 'pasante']),
  upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  crearExposicion
)

// Obtener todas (público)
router.get('/', obtenerExposiciones)

// Obtener una por ID (público)
router.get('/:id', obtenerExposicion)

// ✅ Actualizar exposición
router.put(
  '/:id',
  (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (token?.startsWith('pas_')) {
      verificarTokenPasante(req, res, next)
    } else {
      verificarTokenJWT(req, res, next)
    }
  },
  verificarRoles(['admin', 'admini', 'pasante']),
  upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  actualizarExposicion
)

// ✅ Eliminar exposición
router.delete(
  '/:id',
  (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (token?.startsWith('pas_')) {
      verificarTokenPasante(req, res, next)
    } else {
      verificarTokenJWT(req, res, next)
    }
  },
  verificarRoles(['admin', 'admini', 'pasante']),
  eliminarExposicion
)

// ✅ Pública por QR
router.get('/qr/:id', obtenerExposicionPublica)

export default router