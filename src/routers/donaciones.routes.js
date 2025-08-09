import express from 'express';
import { crearDonacion } from '../controllers/donaciones_controller.js';
import { validarDonacion } from '../middleware/validators.js';

const router = express.Router();

router.post('/crearDonacion', validarDonacion, crearDonacion);

export default router;
