import express from 'express';
import passport from 'passport';
import generarJWT from '../helpers/crearJWT.js';

const router = express.Router();

// Ruta de login con Microsoft
router.get(
  '/microsoft',
  passport.authenticate('azuread-openidconnect', {
    failureRedirect: '/login',
    customState: 'login',
  })
);

// Callback después de loguearse con Microsoft
router.get(
  '/microsoft/callback',
  passport.authenticate('azuread-openidconnect', {
    failureRedirect: '/login',
    session: false,
  }),
  (req, res) => {
    const token = generarJWT(req.user._id);

    // Redirección al frontend con token
    res.redirect(`${process.env.URL_FRONTEND}/login/microsoft?token=${token}`);
  }
);

export default router;