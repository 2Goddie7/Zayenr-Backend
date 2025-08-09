//Verificar campos con express validator

import { check, validationResult } from 'express-validator';

export const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

export const validarLoginAdmin = [
  check('email').isEmail().withMessage('Email inválido'),
  check('password').isLength({ min: 6 }).withMessage('Password mínimo 6 caracteres'),
  validarCampos
];

export const validarCrearPasante = [
  check('nombre').notEmpty().withMessage('Nombre es obligatorio'),
  check('email').isEmail().withMessage('Email inválido'),
  check('facultad').notEmpty().withMessage('Facultad es obligatoria'),
  check('celular').notEmpty().withMessage('Celular es obligatorio'),
  validarCampos
];

export const validarCrearExposicion = [
  check('nombre').notEmpty().withMessage('Nombre es obligatorio'),
  check('descripcion').notEmpty().withMessage('Descripción es obligatoria'),
  validarCampos
];

export const validarDonacion = [
  check('monto').isFloat({ gt: 0 }).withMessage('Monto debe ser mayor a 0'),
  validarCampos
];
