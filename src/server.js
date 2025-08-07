// requerir módulos
import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import "./config/passport.js";

// Rutas importadas
import routerPasantes from "./routers/pasante.routes.js";
import routerExposiciones from "./routers/exposicion.routes.js";
import routerAdmin from "./routers/administrador.routes.js";
import routerDonaciones from "./routers/donaciones.routes.js";
import authRoutes from './routers/auth.routes.js';

const app = express();
dotenv.config();

// Config
app.set("port", process.env.PORT || 3000);

// -------------------------------------------------------------
// MIDDLEWARE CORS
// -------------------------------------------------------------
const corsOptions = {
  origin: ["http://localhost:5173", "https://zayenda.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(express.json());

//Para el commit
// -------------------------------------------------------------
// MIDDLEWARES GENERALES
// -------------------------------------------------------------
app.use(express.json());

app.use(session({
  secret: 'epn2025@',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// -------------------------------------------------------------
// RUTAS
// -------------------------------------------------------------
app.get("/", (req, res) => {
  res.send("Servidor del Museo Gustavo Orcés funcionando correctamente 🏛️");
});

app.use("/api/pasantes", routerPasantes);
app.use("/api/exposiciones", routerExposiciones);
app.use("/api/admin", routerAdmin);
app.use('/api/donaciones', routerDonaciones);
app.use('/api/auth', authRoutes);

// -------------------------------------------------------------
// MIDDLEWARE 404
// -------------------------------------------------------------
app.use((req, res) => {
  console.log(`404 - Endpoint no encontrado: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ msg: "Endpoint no encontrado" });
});

export default app;