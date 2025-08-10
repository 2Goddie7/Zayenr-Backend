import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
dotenv.config();

import Pasante from '../models/Pasante.js';

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
        let pasante = await Pasante.findOne({ email });

        if (!pasante) {
          // Si no existe, lo creamos como pasante con confirmEmail=true
          pasante = new Pasante({
            nombre: profile.displayName,
            email,
            facultad: 'Por definir',
            celular: '',
            fotoPerfil: profile.photos?.[0]?.value || null,
            confirmEmail: true
          });
          await pasante.save();
        }

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
