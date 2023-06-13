//import sessionServices from "../services/session.services.js"
import { comparePassword, hashPassword } from "../utils/crypted.js"
import { UserService as sessionServices } from '../repositories/index.js'
import {logger} from "../utils/logger.js"
import crypto from "crypto"


class sessionValidator {

    async getUsers() {
      const users = await sessionServices.getUsers()
      return users
    }

    async checkAccount(email, password) {

      const user = await sessionServices.getUserByEmail(email)
  
      if (!email || !password) return 'No es un email o password valido'
      if (!user) return 'No es usuario'
      if (!comparePassword(user, password)) return 'Password Incorrecto'
  
      return user;
    }
  
    async restore(email) {
  
      const user = await sessionServices.getUserByEmail(email)
  
      if (!user) throw new Error("Usuario Invalido")
      const token = crypto.randomBytes(20).toString('hex')
      await sessionServices.updateUser(user._id, { token: token, tokenDate: new Date() })
      return token;
    }
  
    async validateToken(token) {
      let response = await sessionServices.getUserByToken(token)
      if (response[0].tokenDate === undefined) return false;
  
      try {
        const fechaInicial = new Date()
        const fechaFinal = response[0].tokenDate
  
        const diferenciaEnMilisegundos = fechaInicial - fechaFinal;
        const diferenciaEnSegundos = Math.floor(diferenciaEnMilisegundos / 1000);
  
        logger.debug(`La diferencia entre las fechas es de ${diferenciaEnSegundos} segundos, si supera los 3000 segundos, ha pasado una hora y el token se invalida.`)
  
        if (diferenciaEnSegundos > 3000) {
          response = 'token caducado'
          console.log("Paso mas de una hora")
          return response
        }
        else {
          console.log("Token correcto enviado")
          console.log(response)
          return response[0]
        }
      } catch (error) {
        return error
      }
    }
  
    async updateUser(token, newPassword) {
      logger.debug("Entrando en update user")
      if (!token | !newPassword) {
        logger.error(`No se recibieron los valores necesarios: token y nueva contraseña`)
        throw new Error('No se informa token ni password')
      }
      const userByToken = await sessionServices.getUserByToken(token)
      const user = await sessionServices.getUserByEmail(userByToken[0].email)
      if (!userByToken) throw new Error("Token no encontrado")
  
      logger.debug(user)
      const password = hashPassword(newPassword)
  
  
      if (comparePassword(user, newPassword)) {
        throw new Error("Contraseña repetida")
      }
  
  
  
      await sessionServices.updateUser(userByToken[0]._id, { password: password })
      logger.debug(`El usuario es : ${user}`)
      await sessionServices.updateUser(user._id, { tokenDate: new Date("2022-04-17T22:25:31.700+00:00") })
      logger.debug(`El usuario despues de la actualizacion es : ${user}`)
    }
  }
  
  export default new sessionValidator()
  