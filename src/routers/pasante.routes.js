import express from 'express'
import {
  confirmarMail,
  obtenerPerfilPasante,
  actualizarPerfilPasante
} from '../controllers/pasante_controller.js'
import verificarTokenPasante from '../middleware/verificarTokenPasante.js';
import { verificarTokenJWT } from '../middleware/JWT.js'
import { verificarRoles } from '../middleware/verificarRoles.js'

import upload from '../middleware/upload.js';


const router = express.Router()

// Confirmar email
router.get('/confirmar/:token', confirmarMail)

router.get('/perfil/:id', verificarTokenPasante, obtenerPerfilPasante);
router.put('/perfil/:id', verificarTokenPasante, upload.single('fotoPerfil'), actualizarPerfilPasante);


// Ruta para que el ADMIN edite datos del pasante
router.put(
  '/admin/pasantes/:id',
  verificarTokenJWT,
  verificarRoles(['admin', 'admini']),
  actualizarPerfilPasante
)

export default router
