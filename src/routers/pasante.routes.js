import express from 'express'
import {
  login,
  confirmarMail,
  recuperarPassword,
  comprobarTokenPassword,
  crearNuevoPassword,
  obtenerPerfilPasante,
  actualizarPerfilPasante
} from '../controllers/pasante_controller.js'

const router = express.Router()

//Login del pasante
router.post('/login', login) // OK

// Confirmar email
router.get('/confirmar/:token', confirmarMail) // OK

// Recuperar contraseña
router.post('/recuperar-password', recuperarPassword) // OK

// Comprobar token para crear nueva contraseña
router.get('/recuperar-password/:token', comprobarTokenPassword) // OK

// Crear nueva contraseña
router.post('/recuperar-password/:token', crearNuevoPassword) // OK


// Obtener perfil del pasante por ID
router.get('/perfil/:id', obtenerPerfilPasante) // OK

// Actualizar perfil de pasante
router.put('/perfil/:id', actualizarPerfilPasante)

// ✅ NUEVA RUTA PARA ADMINISTRADOR
router.put('/admin/perfil/:id', actualizarPerfilPasante)

export default router
