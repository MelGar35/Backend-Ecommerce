import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// Configuración de Passport
passport.use(
  new LocalStrategy(function (username, password, done) {
    // Autenticación del usuario
    if (username === "admin" && password === "admin") {
        return done(null, { username, password });
        }
        return done(null, false);
  })
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

export default passport;
