import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
dotenv.config();

import Pasante from '../models/Pasante.js'; // Asegúrate de que el modelo Pasante esté bien definido

const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${backendUrl}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        
        // Buscar el pasante por correo electrónico
        let pasante = await Pasante.findOne({ email });

        // Si el pasante no existe, no lo creamos y simplemente redirigimos a una página de error o login
        if (!pasante) {
          return done(null, false, { message: 'El correo electrónico no está registrado.' });
        }

        // Si el pasante existe, lo pasamos al siguiente paso (callback)
        return done(null, pasante);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const pasante = await Pasante.findById(id);
  done(null, pasante);
});
