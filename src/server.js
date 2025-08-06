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

app.use(cors({
  origin: 'https://zayenda.netlify.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use(express.json());

app.use(session({
  secret: 'epn2025@',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Ruta base
console.log("Registrando ruta: GET /");
app.get("/", (req, res) => {
  res.send("Servidor del Museo Gustavo Orcés funcionando correctamente 🏛️");
});

// Rutas definidas con logs
console.log("Registrando rutas: /api/pasantes");
app.use("/api/pasantes", routerPasantes);

console.log("Registrando rutas: /api/exposiciones");
app.use("/api/exposiciones", routerExposiciones);

console.log("Registrando rutas: /api/admin");
app.use("/api/admin", routerAdmin);

console.log("Registrando rutas: /api/donaciones");
app.use('/api/donaciones', routerDonaciones);

console.log("Registrando rutas: / (auth)");
app.use('/', authRoutes);

// Middleware para rutas no encontradas
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
