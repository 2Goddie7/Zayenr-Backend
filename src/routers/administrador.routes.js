import express from "express";
import {
  loginAdministrador,
  cambiarPasswordAdministrador,
  obtenerPerfilAdministrador,
  actualizarFotoPerfilAdministrador,
  solicitarRecuperacionPassword,
  recuperarPassword,
  crearAdmin,
  confirmarCuentaAdmini,
  eliminarAdministrador,
  listarAdminis,
  crearPasante,
  obtenerPasantes,
  obtenerPasantePorId,
  actualizarPasante,
  eliminarPasante,
  confirmarPasante,
} from "../controllers/administrador_controller.js";
import { verificarTokenJWT } from "../middleware/JWT.js";
import { validarLoginAdmin, validarCrearPasante } from "../middleware/validators.js";
import upload from '../middleware/upload.js'

const router = express.Router();

// Login administrador
router.post("/login", validarLoginAdmin, loginAdministrador);
// Cambiar contraseña
router.put("/cambiar-password",verificarTokenJWT,cambiarPasswordAdministrador);

//cambiar foto 
router.put('/actualizarFotoPerfil/:id', verificarTokenJWT, upload.single('foto'), actualizarFotoPerfilAdministrador);

//recueprar contraseña 
router.post('/recuperarPassword', solicitarRecuperacionPassword);
router.post('/recuperarPassword/:token', recuperarPassword);


//Crear admin
router.post('/crearAdministrador',verificarTokenJWT,crearAdmin);
router.get("/confirmarAdministrador/:token", confirmarCuentaAdmini);
router.get('/adminis',verificarTokenJWT,listarAdminis)
router.delete('/eliminarAdministrador/:id',verificarTokenJWT,eliminarAdministrador)
// ver datos admin
router.get('/perfil/:id', verificarTokenJWT, obtenerPerfilAdministrador);

// Rutas PASANTES
router.post("/crearPasante", verificarTokenJWT, validarCrearPasante, crearPasante); // listo 
router.get("/obtenerPasante", verificarTokenJWT, obtenerPasantes); // listo
router.get("/confirmarPasante/:token", confirmarPasante) //listo
router.get("/obtenerPasante/:id", verificarTokenJWT, obtenerPasantePorId); //listo
router.put("/actualizarPasante/:id", verificarTokenJWT, actualizarPasante); // falta postman
router.delete("/eliminarPasante/:id", verificarTokenJWT, eliminarPasante); // listo 


export default router;