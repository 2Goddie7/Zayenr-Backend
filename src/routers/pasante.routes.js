import express from 'express'
import {
  registro,
  login,
  confirmarMail,
  recuperarPassword,
  comprobarTokenPassword,
  crearNuevoPassword
} from '../controllers/pasante_controller.js'
import { googleLogin } from '../controllers/pasante_controller.js';

const router = express.Router()

//Login del pasante
router.post('/login', login)//OK

// Registro de pasante
router.post('/registro', registro)//OK

// Confirmar email
router.get('/confirmar/:token', confirmarMail)//OK

// Recuperar contraseña
router.post('/recuperar-password', recuperarPassword)//OK

// Comprobar token para crear nueva contraseña
router.get('/recuperar-password/:token', comprobarTokenPassword)//OK

// Crear nueva contraseña
router.post('/recuperar-password/:token', crearNuevoPassword)//OK

router.post('/google-login', googleLogin)

export default router
