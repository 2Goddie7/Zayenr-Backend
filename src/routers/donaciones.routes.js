import express from 'express';
import { crearDonacion } from '../controllers/donaciones_controller.js';

const router = express.Router();

router.post('/crearDonacion', crearDonacion);

export default router;
