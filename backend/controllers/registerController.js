const RegisterService = require("../services/registerService");
const encrypt = require("../services/encrypt");
const jwt = require("jsonwebtoken");

module.exports = class RegisterController {
  static async insertUser(req, res) {
    const data = {
      name: req.body.name,
      emailID: req.body.emailID,
      password: req.body.password,
    };
    const returnMessage = {
      status: 404,
      isUserUnique: false,
      insertSuccessful: false,
    };

    //check if all the fields are present or not
    if (!(data.name && data.emailID && data.password)) {
      res
        .status(404)
        .send({ ...returnMessage, message: "All the fields are required" });
    } else {
      try {
        const unique = await RegisterService.checkIfTheUserIsUnique(
          data.emailID
        );

        if (!unique) {
          console.log("The user", data.emailID, "already exists");
          res
            .status(404)
            .send({ ...returnMessage, message: "The user already exists" });
        } else {
          console.log(
            "The user",
            data.emailID,
            "is uniuqe. Moving ahead with encrypting password and creating the user."
          );
          const encryptedPassword = await encrypt.cryptPassword(data.password);
          data.password = encryptedPassword;
          const userObj = await RegisterService.createUser(data);
          const user = JSON.parse(JSON.stringify(userObj));
          delete user.password;
          console.log(user);
          const token = jwt.sign(user, process.env.SECRET_KEY, {
            expiresIn: "24h",
          });
          returnMessage.token = token;
          returnMessage.user = user;
          res.status(201).send({
            ...returnMessage,
            status: 201,
            isUserUnique: true,
            insertSuccessful: true,
            user: user,
          });
        }
      } catch (error) {
        console.log(
          "some error occured in registerController.js and the error is",
          error
        );
        res.status(500).json({ error: error });
      }
    }
  }
};
