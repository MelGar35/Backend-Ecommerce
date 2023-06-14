import usersValidator from '../validators/users.validators.js'
import config from "../config/config.js";
import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: config.NODEMAILER_ACCOUNT,
      pass: config.NODEMAILER_PASS
    }
  })

class usersController {

  async getDocumentsPage(req, res) {
      req.logger.info("Documents")
      let user = req.user
      try {
        res.render('documents', { title: "Users", username: user.user, user: user.userID })
      } catch (error) {
        req.logger.error(`Funcion getDocumentsPage en controlador: ${error.message}`)
        res.status(500).json({ message: `Error ${error}` })
  
      }
    }
  
  async changeRolePage(req, res) {
      let json = req.query.json
      const users = await usersValidator.getUsers()
      try {
        if (json) res.status(200).json(users)
        else res.render('changerole', { users })
      } catch (error) {
        req.logger.error(`Funcion changeRolePage en controlador: ${error.message}`)
        res.status(500).json({ error: `Error: ${error.message}` })
      }
    }
  
  async changeRole(req, res) {
      const uid = req.params.uid
      const { role } = req.body
  
      try {
        const users = await usersValidator.getUsers()
        await usersValidator.changeRole(role, uid)
        res.render('changerole', { users })
      } catch (error) {
        req.logger.error(`Funcion changeRole en controlador: ${error.message}`)
        res.status(400).json({ message: "An error as occurred" })
      }
    }
  
  async uploadDocs(req, res) {
      req.logger.debug("Uploading documents... ")
  
      const uid = req.params.uid
      const data = req.files
  
      try {
        const response = await usersValidator.updateUserDocuments(uid, data)
        res.render('documents', { message: "Perfil actualizado" })
      } catch (error) {
        req.logger.error(`Funcion uploadDocs en controlador: ${error.message}`)
        res.json({ error: error.message }) 
      }
    }
  
  async deleteInactiveUsers(req, res) {
  
      req.logger.debug("Eliminando usuarios inactivos")
      try {
  
        const usuariosAEliminar = await usersValidator.findInactiveUsers()
        const mails = usuariosAEliminar.map(el => el.email)
  
        await usersValidator.deleteInactiveUsers()
  
        await transport.sendMail({
          from: 'Melisa <nicecup.ventas@gmail.com>',
          to: mails,
          subject: 'Su cuenta ha sido eliminada',
          html: `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <title>Cuenta eliminada por inactividad</title>
        </head>
        <body>
        <div>
           <h1>Cuenta eliminada por inactividad</h1>
           <p>Estimado/a Usuario/a,</p>
           <p>Tu cuenta ha sido eliminada debido a la inactividad prolongada. Para poder acceder debes registrarte nuevamente.</p>
        </div>
        </body>
        </html>
        `, attachments: []
        })

        res.status(200).json({ message: "Usuarios eliminados" })
      } catch (error) {
        req.logger.error(`Funcion deleteInactiveUsers en controlador: ${error.message}`)
  
        res.status(500).json({ message: error.message })
      }
    }
  
  async deleteUser(req, res) {
  
      const userId = req.params.uid
      req.logger.debug(`ID de usuario a eliminar: ${userId}`)
  
      try {
        await usersValidator.deleteUser(userId)
        res.status(200).json({ message: "Usuario eliminado" })
      } catch (Error) {
        req.logger.error(`Funcion deleteUser en controlador: ${Error.message}`)
  
        res.status(403).json({ error: Error })
  
      }
    }
  }
  
export default new usersController()
  
  
  