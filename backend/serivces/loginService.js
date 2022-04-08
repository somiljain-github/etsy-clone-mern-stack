const UserModel = require("../models/userModel");

module.exports = class LoginService {
  static async getUser({ emailID }) {
    const query = { emailID };
    const userObj = {};
    try {
      const result = await UserModel.findOne(query);

      if (result) {
        userObj.userFound = true;
        userObj.user = result;
      } else {
        userObj.userFound = false;
      }
      return userObj;
    } catch (error) {
      console.log(`Could not fetch the user in loginservice service ${error}`);
    }
  }
};
