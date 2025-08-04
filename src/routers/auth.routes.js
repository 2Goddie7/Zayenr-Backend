import express from 'express'
import passport from 'passport'
import generarJWT from '../helpers/crearJWT.js'

const router = express.Router()

router.get('/microsoft',
  passport.authenticate('azuread-openidconnect', {
    failureRedirect: '/login',
    customState: 'login',
  })
)

// Callback despues de logearse con microsoft 
router.get('/microsoft/callback',
  passport.authenticate('azuread-openidconnect', {
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    const token = generarJWT(req.user._id)

    // redireccion al frontend 
    res.redirect(`${process.env.URL_FRONTEND}login/microsoft?token=${token}`);
  }
)

export default router
