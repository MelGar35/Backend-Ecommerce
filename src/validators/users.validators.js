import { UserService } from "../repositories/index.js"

class usersValidator {

  async getUsers() {
    const users = await UserService.getUsers()
    return users
  }


  async changeRole(role, uid) {
    if (!role) throw new Error("Missing role")
    if (!uid) throw new Error("Missing UID")
    if (!await UserService.getUserById(uid)) throw new Error("User not found")

    try {
      await UserService.updateUser(uid, { role: role })
    } catch (error) {
      return error
    }

  }


  async deleteUser(uid) {
    console.log(`VAL: Eliminando usuario con id ${uid}`)


    const usuariosExcluidos = ['640dfe483d9a85c2cbdc44d6', '6429686e7ea1c5f5b46d804b', '644709cf130471ec9f3a268c']; // Usuarios son admin, premium y user


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
    console.log("VAL: Eliminando usuarios inactivos")

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
    if (!uid) throw new Error("Missing UID")
    if (!data) throw new Error("Missing DATA")
    if (!await UserService.getUserById(uid)) throw new Error("User not found")
    console.log("uploading user")
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
