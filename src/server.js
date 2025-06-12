// requerir módulos 
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

// Rutas importadas
import routerPasantes from './routers/pasante.routes.js'
import routerExposiciones from './routers/exposicion.routes.js'

const app = express()
dotenv.config()

// Configuraciones
app.set('port', process.env.PORT || 3000)
app.use(cors())
app.use(express.json());

// Ruta base
app.get('/', (req, res) => {
    res.send("Servidor del Museo Gustavo Orcés funcionando correctamente 🏛️")
})

// Rutas definidas
app.use('/api/pasantes', routerPasantes)
app.use('/api/exposiciones', routerExposiciones)

// Middleware para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ msg: "Endpoint no encontrado" })
})
/*
// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Manejo global de error:', err);
  res.status(err.status || 500).json({
    msg: err.message || 'Error inesperado',
    error: err
  });
});
*/

export default app
