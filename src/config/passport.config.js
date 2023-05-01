import passport from 'passport';
import jwt from 'passport-jwt';
import local from 'passport-local'
import usersDto from "../daos/dto/users.dto.js"
import usersDao from '../daos/mongo/users.mongo.js'
import {
  hashPassword as createHash
} from '../utils/crypted.js'
import CustomError from '../utils/CustomError.js'
import generateUserError from '../utils/generateUserError.js'
import ErrorList from '../utils/ErrorList.js';

const LocalStrategy = local.Strategy
const headersExtractor = (req) => {
  let token = null
  if (req && req.headers) {
    token = req.headers["Authorization"]
  }
  return token
}

const cookieExtractor = (req) => {
  let token = null
  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"]
  }
  return token
}

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

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


  passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
  }, async (req, username, password, done) => {
    const {
      first_name,
      last_name,
      email,
      age,
      phone,
      role
    } = req.body;


    if (!first_name || !last_name || !email || !/^[0-9]*$/.test(age) || !age || !phone || !/\+[0-9]+/i.test(phone) || !role) {
      CustomError.createError({
        name: "Error creating user",
        cause: generateUserError({
          first_name,
          last_name,
          email,
          age,
          phone,
          role
        }),
        message: "Error trying to register user",
        code: ErrorList.INVALID_TYPE_ERROR
      })
    }
    try {
      let user = await usersDao.getUserByEmail(username)
      if (user) {
        console.log('Usuario existente')
        return done(null, false)
      }

      const createdUser = new usersDto(first_name, last_name, email, age, phone, role)
      createdUser.password = createHash(password)

      let result = await usersDao.createUser(createdUser)
      return done(null, result)
    } catch (error) {
      done(error)
    }
  }))
}



export default initializePassport