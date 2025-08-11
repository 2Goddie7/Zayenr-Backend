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
import { validarCrearExposicion } from '../middleware/validators.js'

import { verificarTokenJWT } from '../middleware/JWT.js'
import  verificarTokenPasante  from '../middleware/verificarTokenPasante.js'
import { verificarRoles } from '../middleware/verificarRoles.js'

const router = express.Router()

router.post(
  '/crearExposicion',
  (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1]
    if (token?.startsWith('pas_')) {
      token = token.slice(4)
      req.headers.authorization = 'Bearer ' + token
      verificarTokenPasante(req, res, next)
    } else {
      verificarTokenJWT(req, res, next)
    }
  },
  verificarRoles(['administrador', 'admini', 'pasante']),
  upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  validarCrearExposicion,
  crearExposicion
)


// Obtener todas
router.get('/', obtenerExposiciones)


router.get('/qr/:id', obtenerExposicionPublica)

router.get('/:id', obtenerExposicion)


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
  verificarRoles(['administrador', 'admini', 'pasante']),
  upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  actualizarExposicion
)

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
  verificarRoles(['administrador', 'admini', 'pasante']),
  eliminarExposicion
)

export default router