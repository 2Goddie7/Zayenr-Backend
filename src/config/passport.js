import passport from 'passport'
import { OIDCStrategy } from 'passport-azure-ad'
import dotenv from 'dotenv'
dotenv.config()

import Pasante from '../models/Pasante.js'

const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';

const strategy = new OIDCStrategy({
  identityMetadata: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/v2.0/.well-known/openid-configuration`,
  clientID: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  responseType: 'code',
  responseMode: 'query',
  redirectUrl: `${backendUrl}/api/auth/microsoft/callback`, // NOTA: ahora incluye /api/auth
  allowHttpForRedirectUrl: backendUrl.startsWith('http://'),
  scope: ['profile', 'email', 'openid'],
  passReqToCallback: false,
}, async (iss, sub, profile, done) => {
  try {
    const email = profile._json.preferred_username;
    let pasante = await Pasante.findOne({ email });

    if (!pasante) return done(null, false, { message: 'Correo no registrado o no autorizado' });
    if (!pasante.confirmEmail) return done(null, false, { message: 'Debes confirmar tu cuenta desde el correo' });

    pasante.microsoftId = profile.oid;
    await pasante.save();
    return done(null, pasante);
  } catch (err) {
    return done(err, null);
  }
});


passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const pasante = await Pasante.findById(id);
  done(null, pasante);
});
