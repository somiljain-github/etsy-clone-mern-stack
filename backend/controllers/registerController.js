const RegisterService = require("../serivces/registerService");

module.exports = class RegisterController {
  static async insertUser(req, res, next) {
    const data = {
      name: req.body.name,
      emailID: req.body.email,
      password: req.body.password,
    };
    const returnMessage = {
      status: 404,
      isUserUnique: false,
      insertSuccessful: false,
    };
    if (!(data.name && data.emailID && data.password)) {
      res
        .status(404)
        .send({ ...returnMessage, message: "All the fields are required" });
    }
    try {
      const unique = await RegisterService.checkIfTheUserIsUnique(data.emailID);

      if (!unique) {
        res
          .status(404)
          .send({ ...returnMessage, message: "The user already exists" });
      } else {
        const userInserted = await RegisterService.createUser(data);
        console.log("the temp is ", userInserted);
        res.status(200).send({
          ...returnMessage,
          status: 200,
          isUserUnique: true,
          insertSuccessful: true,
          returnObjectFromDB: userInserted,
        });
      }
    } catch (error) {
      console.log("some error occured in registerController.js ");
      res.status(500).json({ error: error });
    }
  }
};
