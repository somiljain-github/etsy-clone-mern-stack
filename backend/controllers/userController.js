module.exports = class UserController {
  static async getUserDetails(req, resp) {
    const id = req.params.id;
    resp.send("yo");
  }
};
