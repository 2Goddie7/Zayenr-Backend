// requerir módulos
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import "./config/passport.js";

// Rutas importadas
import routerPasantes from "./routers/pasante.routes.js";
import routerExposiciones from "./routers/exposicion.routes.js";
import routerAdmin from "./routers/administrador.routes.js";
import routerDonaciones from "./routers/donaciones.routes.js";
import authRoutes from './routers/auth.routes.js';

const app = express();
dotenv.config();

// Configuraciones
app.set("port", process.env.PORT || 3000);

// Configuración de CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://zayenda.netlify.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Responder inmediatamente a preflight
  }

  next();
});




app.use(session({
  secret: 'epn2025@',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Ruta base
app.get("/", (req, res) => {
  res.send("Servidor del Museo Gustavo Orcés funcionando correctamente 🏛️");
});

// Rutas definidas 
app.use("/api/pasantes", routerPasantes);

app.use("/api/exposiciones", routerExposiciones);

app.use("/api/admin", routerAdmin);

app.use('/api/donaciones', routerDonaciones);

app.use('/api/auth', authRoutes);

//Middleware para rutas no encontradas
console.log("Registrando middleware de rutas no encontradas");
app.use((req, res) => {
  res.status(404).json({ msg: "Endpoint no encontrado" });
});

// Middleware de manejo de errores
/*
app.use((err, req, res, next) => {
  console.error('Manejo global de error:', err);
  res.status(err.status || 500).json({
    msg: err.message || 'Error inesperado',
    error: err
  });
});
*/

export default app;

// okidoki