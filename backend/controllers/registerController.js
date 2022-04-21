const RegisterService = require("../services/registerService");
const encrypt = require("../services/encrypt");
const jwt = require("jsonwebtoken");
const kafka = require("../kafka/client");

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
        let message = {
          function: "checkIfTheUserIsUnique",
          data: data.emailID,
        };
        kafka.make_request("topic-register", message, async (err, unique) => {
          if (err) {
            console.error(err);
            res.json({
              status: "Error",
              message: "System error, try again",
            });
          } else {
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
              const encryptedPassword = await encrypt.cryptPassword(
                data.password
              );
              data.password = encryptedPassword;
              message = {
                function: "createUser",
                data: data,
              };
              kafka.make_request(
                "topic-register",
                message,
                async (error, userObj) => {
                  if (error) {
                    console.error(error);
                    res.json({
                      status: "Error",
                      message: "System error, try again",
                    });
                  } else {
                    const user = JSON.parse(JSON.stringify(userObj));
                    delete user.password;
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
                      message: "User created",
                    });
                  }
                }
              );
            }
          }
        });
      } catch (error) {
        console.log(
          "some error occured in registerController.js and the error is",
          error
        );
        res.status(500).json({
          error,
          message:
            "There was an error in registering backend. Please try again",
        });
      }
    }
  }
};
