const UserModel = require("../db/models/userModel");
const ItemModel = require("../db/models/itemModel");

class LoginService {
  static async getUser(data, callback) {
    const emailID = data.emailID;
    console.log("the emailID from kafka is", emailID);
    const query = { emailID };
    const userObj = {};
    let userObjCopy = {};
    try {
      const result = await UserModel.findOne(query).lean();
      
      if (result) {
        userObj.userFound = true;
        userObj.user = result;
      } else {
        userObj.userFound = false;
      }
      
      if(userObj.user.favourites.length > 0){
        const records = await ItemModel.find().where('_id').in(userObj.user.favourites).exec();
        userObj.favouriteItems = records;
      }
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
