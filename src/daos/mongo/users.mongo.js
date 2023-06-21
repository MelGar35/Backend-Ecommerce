import { userModel } from "../models/user.model.js";

class UserDao {
  async getUsers() {
    return await userModel.find();
  }

  async getUserById(id) {
    return await userModel.findOne({ _id: id });
  }

  async getUserByEmail(email) {
    return await userModel.findOne({ email });
  }

  async createUser(data) {
    return await userModel.create(data);
  }

  async updateUser(id, data) {

    console.log('Actualizando informacion del Usuario')

    if (data.name) { // Si estamos actualizando el rol del usuario
      console.log("Actualizando rol de usuario")
      await userModel.findOneAndUpdate( // Manejando actualizacion  de documentos
        { _id: id },
        { $pull: { documents: { name: data.name } } },
        { new: true },
        async (err, userActualizado) => {
          if (err) {
            console.error(err);
          } else {
            // Buscar si ya existe un objeto con el mismo nombre
            const objetoExistente = userActualizado.documents.find(doc => doc.name === data.name);

            // Si existe, reemplazarlo; de lo contrario, agregarlo al arreglo
            if (objetoExistente) {
              objetoExistente.reference = data.reference;
            } else {
              userActualizado.documents.push(data);
            }

            // Guardar los cambios en la base de datos
            try {
              const resultado = await userActualizado.save();
              console.log(resultado);
              // El usuario ha sido actualizado correctamente
            } catch (error) {
              console.error(error);
              // Manejar el error al guardar los cambios
            }
          }
        }
      );
    } else {
      const adminUID = '641348b727e3f9714a55955e'
      await userModel.updateOne({
        $and: [
          {
            _id: id
          },
          {
            _id: { $nin: adminUID }
          }
        ]
      },
        { $set: data });
    }
  }

  async deleteUser(id) {
    return await userModel.deleteOne(
      {
        _id: id
      })
      .then(result => console.log(result))
      .catch(error => {
        throw new Error(error)
      })
  }

  async findInactiveUsers() {
    console.log("MONGO: Buscando usuarios inactivos")
    let requiredTime = new Date();
    requiredTime.setDate(requiredTime.getDate() - 2);

    const usuariosExcluidos = ['641348b727e3f9714a55955e',"64923f214eebd8005ef2723a", '641288ee9d3a2534e063b30a']; // Usuarios son admin, premium y user

    const usuariosInactivos = await userModel.find(
      {
        $and: [
          { last_connection: { $lt: requiredTime } }, // Condición para encontrar usuarios con última conexión anterior a dos días atrás
          { _id: { $nin: usuariosExcluidos } } // Condición para excluir ciertos usuarios por sus IDs
        ]
      }, 'email -_id'
    );

    return usuariosInactivos;
  }

  async deleteInactiveUsers() {
    console.log("MONGO: Eliminando usuarios")
    let requiredTime = new Date()
    requiredTime.setDate(requiredTime.getDate() - 2)

    const usuariosExcluidos = ['641348b727e3f9714a55955e',"64923f214eebd8005ef2723a" ,'641288ee9d3a2534e063b30a']; // Usuarios son admin, premium y user
    userModel.deleteMany(
      {
        $and: [
          { last_connection: { $lt: requiredTime } }, // Condición para encontrar usuarios con última conexión anterior a dos días atrás
          { _id: { $nin: usuariosExcluidos } } // Condición para excluir ciertos usuarios por sus IDs
        ]
      }
    )
      .then(result => {
        // Manejar el resultado si es necesario
        console.log(result)
      })
      .catch(error => {
        // Manejar el error si ocurre
        console.log(error)
      });
  }

  async getUserByToken(token) {
    try {
      return await userModel.find({ token: token },
        {
          password: 0, role: 0, username: 0, _v: 0, restoreToken: 0, age: 0, __v
            : 0
        })
    } catch (error) {
      return error;
    }
  }
}

export default new UserDao()
