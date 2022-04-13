const UserModel = require("../models/userModel");

module.exports = class RegisterService {
  static async checkIfTheUserIsUnique(emailID) {
    console.log("in the register service and the data is ", emailID);
    const query = { emailID };
    try {
      const result = await UserModel.findOne(query);
      return result == null ? true : false;
    } catch (error) {
      console.log(`Could not fetch the user in user service ${error}`);
    }
  }

  static async createUser({ name, emailID, password }) {
    try {
      const query = {
        name,
        emailID,
        password,
      };
      const user = new UserModel(query);
      let savedUser;
      let result = await user.save().then((user) => (savedUser = user));
      console.log("the result is ", result);
      return result ? result : {};
    } catch (error) {
      console.log("some error occured in registerService.js");
      console.log(error);
    }
  }
};
