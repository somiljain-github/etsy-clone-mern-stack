const UserService = require("../serivces/UserService");

module.exports = class UserController {
  static async getUserDetails(req, resp) {
    const userParamsObj = { userID: req.params.userID };

    const userObj = await UserService.getUser(userParamsObj);
    if (userObj && !userObj.userFound) {
      console.log(
        "The user with id as",
        userParamsObj.userID,
        "does not exist."
      );
      resp.status(400).send({
        ...returnMessage,
        success: false,
        status: 400,
        message: "The user does not exist.",
      });
    } else {
      console.log(
        "user with id as",
        userParamsObj.userID,
        "found. Moving ahead with getting respective items"
      );
      if (userObj.user.shopName) {
        const items = await UserService.getItems(userParamsObj);
        if (items && items.itemFound) {
          userObj.user.item = item;
        }
      }
    }
    resp.status(200).send(userObj);
  }

  static async updateUserDetails(req, resp) {
    const userParamsObj = { userID: req.params.userID };
    userParamsObj.userDetails = req.body;
    const response = {};
    try {
      const result = await UserService.updateUser(userParamsObj);
      if (result) {
        response.user = result;
        response.success = true;
        response.status = "200";
        return resp.status(200).send(response);
      }
    } catch (e) {
      console.log(e);
      response.success = false;
      response.error = "Some error occurred. Please try again later";
      response.status = "500";
      resp.status(500).send(response);
    }
  }
};
