import { UserService } from "../repositories/index.js"

class usersValidator {

  async getUsers() {
    const users = await UserService.getUsers()
    return users
  }


  async changeRole(role, uid) {
    if (!role) throw new Error("Rol extraviado")
    if (!uid) throw new Error("Id del usuario extraviado")
    if (!await UserService.getUserById(uid)) throw new Error("Usuario no encontrado")

    try {
      await UserService.updateUser(uid, { role: role })
    } catch (error) {
      return error
    }
  }

  async deleteUser(uid) {
    console.log(`Eliminando usuario con id ${uid}`)

    const usuariosExcluidos = ['641348b727e3f9714a55955e', '64923f214eebd8005ef2723a', '64127772aa1e08b237d3e48f']; // Usuarios son admin, premium y user


    if (!uid) throw new Error("MISSING UID")
    if (usuariosExcluidos.includes(uid)) {
      throw new Error("No se puede eliminar este usuario.");
    }

    try {
      await UserService.deleteUser(uid)
    } catch (error) {
      throw new Error(error)

    }
  }

  async deleteInactiveUsers() {
    console.log("Eliminando usuarios inactivos")

    try {
      await UserService.deleteInactiveUsers()
    } catch (error) {
      throw new Error(`${error}`)
    }
  }

  async findInactiveUsers() {
    try {
      return await UserService.findInactiveUsers()
    } catch (error) {
      throw new Error(error)
    }
  }



  async updateUserDocuments(uid, data) {
    if (!uid) throw new Error("No se encuentra el Id del Usuario")
    if (!data) throw new Error("Se ha extraviado informaciòn")
    if (!await UserService.getUserById(uid)) throw new Error("Usuario no encontrado")
    console.log("actualizando usuario")
    const nombreArr = Object.keys(data)[0]
    const documents = []
    documents.push({ name: data[nombreArr][0].fieldname, reference: data[nombreArr][0].path })
    const document = ({ name: data[nombreArr][0].fieldname, reference: data[nombreArr][0].path })


    try {
      await UserService.updateUser(uid, document)
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }
}

export default new usersValidator()
