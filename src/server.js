// requerir módulos
import express from "express";
import dotenv from "dotenv";
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

// ====================
// MIDDLEWARE CORS
// ====================
app.use((req, res, next) => {
  console.log(`CORS Middleware ejecutado: ${req.method} ${req.originalUrl}`);

  res.header("Access-Control-Allow-Origin", "https://zayenda.netlify.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    console.log("Respondiendo preflight (OPTIONS)");
    return res.sendStatus(200);
  }

  next();
});

// ====================
// MIDDLEWARES GENERALES
// ====================
app.use(express.json());

app.use(session({
  secret: 'epn2025@',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// ====================
// RUTAS
// ====================
app.get("/", (req, res) => {
  res.send("Servidor del Museo Gustavo Orcés funcionando correctamente 🏛️");
});

app.use("/api/pasantes", routerPasantes);
app.use("/api/exposiciones", routerExposiciones);
app.use("/api/admin", routerAdmin);
app.use('/api/donaciones', routerDonaciones);
app.use('/api/auth', authRoutes);

// ====================
// MIDDLEWARE 404
// ====================
app.use((req, res) => {
  console.log(`404 - Endpoint no encontrado: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ msg: "Endpoint no encontrado" });
});

// ====================
// EXPORTAR APP
// ====================
export default app;