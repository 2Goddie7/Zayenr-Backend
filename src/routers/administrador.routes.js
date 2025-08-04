import express from "express";
import upload from "../middleware/upload.js"; // para manejo de archivos en exposiciones
import {
  loginAdministrador,
  cambiarPasswordAdministrador,
  obtenerPerfilAdministrador,
  crearAdmin,
  confirmarCuentaAdmini,
  eliminarAdministrador,
  listarAdminis,
  crearPasante,
  obtenerPasantes,
  obtenerPasantePorId,
  actualizarPasante,
  eliminarPasante,
  crearExposicion,
  obtenerExposiciones,
  obtenerExposicionPorId,
  actualizarExposicion,
  eliminarExposicion,
  confirmarPasante,
} from "../controllers/administrador_controller.js";
import { verificarTokenJWT } from "../middleware/JWT.js";

const router = express.Router();

// Login administrador
router.post("/login", loginAdministrador);
// Cambiar contraseña
router.put(
  "/cambiar-password",
  verificarTokenJWT,
  cambiarPasswordAdministrador
);
//Crear admin
router.post('/crearAdministrador',verificarTokenJWT,crearAdmin);
router.get("/confirmarAdministrador/:token", confirmarCuentaAdmini);
router.get('/adminis',verificarTokenJWT,listarAdminis)
router.delete('/eliminarAdministrador',verificarTokenJWT,eliminarAdministrador)

router.get('/perfil/:id', verificarTokenJWT, obtenerPerfilAdministrador);

// Rutas PASANTES
router.post("/crearPasante", verificarTokenJWT, crearPasante);
router.get("/obtenerPasante", verificarTokenJWT, obtenerPasantes);
router.get("/confirmarPasante/:token",verificarTokenJWT, confirmarPasante)
router.get("/obtenerPasante/:id", verificarTokenJWT, obtenerPasantePorId);
router.put("/actualizarPasante/:id", verificarTokenJWT, actualizarPasante);
router.delete("/eliminarPasante/:id", verificarTokenJWT, eliminarPasante);

// Rutas EXPOSICIONES
router.post(
  "/exposiciones",
  verificarTokenJWT,
  upload.fields([
    { name: "imagen", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  crearExposicion
); // Crear exposición con archivos

router.get("/exposiciones", verificarTokenJWT, obtenerExposiciones);
router.get("/exposiciones/:id", verificarTokenJWT, obtenerExposicionPorId);
router.put(
  "/exposiciones/:id",
  verificarTokenJWT,
  upload.fields([
    { name: "imagen", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  actualizarExposicion
);
router.delete("/exposiciones/:id", verificarTokenJWT, eliminarExposicion);

export default router;