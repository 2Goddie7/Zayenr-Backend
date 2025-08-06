import express from 'express'
import {
  confirmarMail,
  obtenerPerfilPasante,
  actualizarPerfilPasante
} from '../controllers/pasante_controller.js'
import verificarTokenPasante from '../middleware/verificarTokenPasante.js';
import { verificarTokenJWT } from '../middleware/JWT.js'
import { verificarRoles } from '../middleware/verificarRoles.js'

const router = express.Router()

//Login del pasante

// Confirmar email
router.get('/confirmar/:token', confirmarMail) // OK

router.get('/perfil/:id', verificarTokenPasante, obtenerPerfilPasante);
router.put('/perfil/:id', verificarTokenPasante, actualizarPerfilPasante);



// Ruta para que el ADMIN edite datos del pasante
router.put(
  '/admin/pasantes/:id',
  verificarTokenJWT,
  verificarRoles(['admin', 'admini']),
  actualizarPerfilPasante
)

export default router
