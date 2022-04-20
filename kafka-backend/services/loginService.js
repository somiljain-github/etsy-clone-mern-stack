const UserModel = require("../db/models/userModel");

class LoginService {
  static async getUser(data, callback) {
    const emailID = data.emailID;
    console.log("the emailID from kafka is", emailID);
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
      //   wont be needing this - return userObj;
      callback(null, userObj);
    } catch (error) {
      console.log(`Could not fetch the user in loginservice service ${error}`);
    }
  }
}

function handle_request(msg, callback) {
  console.log(msg);
  if (msg.function === "getUser") {
    LoginService.getUser(msg.data, callback);
  }
}

exports.handle_request = handle_request;
