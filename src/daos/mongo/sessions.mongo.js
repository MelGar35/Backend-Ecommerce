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

    console.log("Actualizando Usuario")
    console.log(data)
    return await userModel.updateOne({ _id: id }, { $set: data });
  }

  async deleteUser(id) {
    return await userModel.deleteOne({ _id: id });
  }

  async getUserByToken(token) {
    try {
      return await userModel.find({ token: token },
        {
          password: 0, role: 0, username: 0, _v: 0, restoreToken: 0, age: 0, __v : 0
        })
    } catch (error) {
      return error;
    }
  }
}

export default new UserDao()
