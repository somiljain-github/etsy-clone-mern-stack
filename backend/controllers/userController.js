const UserService = require("../serivces/UserService");

module.exports = class UserController {
  static async getUserDetails(req, resp) {
    const userParamsObj = { userID: req.params.id };

    const userObj = await UserService.getUser(userParamsObj);
    // console.log(userObj);
    if (userObj && !userObj.userFound) {
      console.log(
        "The user with id as",
        userParamsObj.userID,
        "does not exist."
      );
      res.status(400).send({
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
};
