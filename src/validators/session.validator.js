//import sessionServices from "../services/session.services.js"
import { comparePassword } from "../utils/crypted.js"
import { UserService as sessionServices } from '../repositories/index.js'


class sessionValidator {


  async checkAccount(email, password) {

    const user = await sessionServices.getUserByEmail(email)

    if(!email || !password) return "No email or password"
    if(!user) return "Not an User"
    if(!comparePassword(user,password)) return "Wrong Password"

    return user
  }
}

export default new sessionValidator()
