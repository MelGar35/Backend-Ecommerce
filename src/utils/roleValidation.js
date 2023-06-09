import { UserService } from "../repositories/index.js"

// Middleware que permite verificar si un usuario tiene la documentacion necesaria
const roleValidation = () => {
  return async (req, res, next) => {
    const user = await UserService.getUserById(req.params.uid) // Traemos al usuario y su informacion

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }
    // Verificamos que existan los documentos necesarios
    const identification = user.documents.find(el => el.name === "identification")
    const location = user.documents.find(el => el.name === "location")
    const accountStatus = user.documents.find(el => el.name === "accountStatus")



    // Validamos
    if ((!identification | !location | !accountStatus) && user.role === "user") {
      console.log("Usuario sin documentos documentos necesarios")
      return res.status(403).json({ message: 'El usuario no tiene los documentos necesarios para ser premium' })
    }


    next()
  }
}

export default roleValidation
