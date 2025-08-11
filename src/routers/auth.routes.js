import express from 'express';
import passport from 'passport';
import generarJWT from '../helpers/crearJWT.js';
import '../config/passport.js'
import '../config/passport-google.js'

const router = express.Router();

// --------------------------------------------------------------------------------------------------------
//               MICROSFOT 
// --------------------------------------------------------------------------------------------------------

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
    res.redirect(`${process.env.URL_FRONTEND}/dashboard?token=${token}`);
  }
);

// --------------------------------------------------------------------------------------------------------
//               GOOGLE 
// --------------------------------------------------------------------------------------------------------

// Inicio de sesión con Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = generarJWT(req.user._id);
    res.redirect(`${process.env.URL_FRONTEND}/dashboard?token=${token}`);
  }
);//areglo de turas 

export default router;