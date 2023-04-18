import sessionValidator from '../validators/session.validator.js'
import jwt from "jsonwebtoken"
import currentUserDto from "../daos/dto/currentUser.dto.js"

class sessionsController {

  async getLoginPage(req, res) {
    res.render('login')
  }

  async getCurrentProfile(req, res) {
    res.render('current', {user : req.user})
  }

  async getRegisterPage(req, res) {
    res.render('register')
  }

  async postToRegister(req, res) {
    req.logger.info("Register succesfully")
    res.render('login', { message: "Te has registrado exitosamente" })
  }

  async failedRegister(req, res) {
    req.logger.error("Ocurrio un error en el registro")
    res.send({ status: 'failure', message: "Ha ocurrido un error en el registro" })
  }

  async postToLogin(req, res) {
    const { email, password } = req.body;

    const checkedAccount = await sessionValidator.checkAccount(email, password)
    const userToSign = new currentUserDto(checkedAccount)

    if (checkedAccount === 'NoMailNorPassword') return res.send('Mail or password missing')
    if (checkedAccount === 'NoUser') return res.send('User has not been found')
    if (checkedAccount === 'IncorrectPassword') return res.send('Incorrect Password')
    if (checkedAccount) {
      const token = jwt.sign({ user: userToSign.email, role: userToSign.role }, 'coderSecret', { expiresIn: '15m' }, { withCredentials: true });
      res.cookie('coderCookieToken', token, { maxAge: 60 * 60 * 60, httpOnly: true, withCredentials: false });
      req.logger.info("El Usuario inicio sesión")
      res.redirect('/api/session/current')

    }

  }

  async getFailedRegisterPage(req, res) {
    req.logger.error("Ha ocurrido un error en el registro")
    res.send({ status: 'failure', message: 'Ha ocurrido un error en el registro' })

  }

}



export default new sessionsController()
