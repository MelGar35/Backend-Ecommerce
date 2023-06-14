import passport from 'passport';
import jwt from 'passport-jwt';
import usersDTO from "../daos/dto/users.dto.js"
import usersDao from '../daos/mongo/sessions.mongo.js'
import {hashPassword as createHash} from '../utils/crypted.js'
import local from "passport-local"

const LocalStrategy = local.Strategy;
const headersExtractor = (req) => {
  let token = null;
  if (req && req.headers) {
    token = req.headers["Authorization"];
  }
  return token;
}

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
  }
  return token;
}

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy({
      jwtFromRequest: cookieExtractor,
      secretOrKey: "coderSecret"
    },
      async (jwtPayload, done) => {
        try {
          return done(null, jwtPayload)
        } catch (error) {
          done(error);
        }
      })
  )


  passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
      const { first_name, last_name, email, age, phone } = req.body;
      let role = "user"

      try {
        let user = await usersDao.getUserByEmail(email)
        console.log(user)

        if (user) {
          console.log('Usuario ya existe')
          return done(null, { message: "Usuario ya existe" })
        }

        if (first_name && last_name && email && age && phone) {

          const createdUser = new usersDTO(first_name, last_name, email, age, phone, role)
          createdUser.password = createHash(password)


          let result = await usersDao.createUser(createdUser)
          return done(null, result)
        }
      } catch (error) {
        done(error)
      }
    }
  ))
}


export default initializePassport;
