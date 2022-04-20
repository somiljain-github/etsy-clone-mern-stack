// const LoginService = require("../services/loginService");
const encrypt = require("../services/encrypt");
const jwt = require("jsonwebtoken");
const kafka = require("../kafka/client");

module.exports = class LoginController {
  static async loginUser(req, res) {
    const data = {
      emailID: req.body.emailID,
      password: req.body.password,
    };
    const returnMessage = {};

    //check if all the fields are present or not
    if (!(data.emailID && data.password)) {
      res.status(404).send({
        ...returnMessage,
        success: false,
        status: 400,
        message: "All the fields are required",
      });
    } else {
      let message = { function: "getUser", data: data };
      kafka.make_request("topic-login", message, async (err, userObj) => {
        if (err) {
          console.error(err);
          resp.json({
            status: "Error",
            msg: "System error, try again",
          });
        } else {
          try {
            if (userObj && !userObj.userFound) {
              console.log("The user", data.emailID, "does not exist.");
              res.status(400).send({
                success: false,
                status: 400,
                message: "The user does not exist.",
              });
            } else {
              console.log(
                "The user",
                data.emailID,
                "found. Moving ahead with encrypting password and comparing that."
              );
              const passwordMatch = await encrypt.comparePassword(
                data.password,
                userObj.user.password
              );
              if (!passwordMatch) {
                returnMessage.success = false;
                returnMessage.status = "400";
                returnMessage.message = "Invalid credentials";
                return res.status(400).send(returnMessage);
              } else {
                //the user is a JSON object which contains _id, emailID, name, password, userDefinedCategories, cart, favourites, etc.
                //the password will be deleted and this user object will be embedded in the jwt.
                const user = JSON.parse(JSON.stringify(userObj.user));
                delete user.password;
                const token = jwt.sign(user, process.env.SECRET_KEY, {
                  expiresIn: "24h",
                });
                returnMessage.user = user;
                returnMessage.token = token;
                returnMessage.success = true;
                returnMessage.status = 201;
                return res.status(201).send(returnMessage);
              }
            }
          } catch (error) {
            console.log(
              "some error occured in loginController.js and the error is",
              error
            );
            res.status(500).json({ error: error });
          }
        }
      });

      // try {
      //   const userObj = await LoginService.getUser(data);

      //   if (userObj && !userObj.userFound) {
      //     console.log("The user", data.emailID, "does not exist.");
      //     res.status(400).send({
      //       ...returnMessage,
      //       success: false,
      //       status: 400,
      //       message: "The user does not exist.",
      //     });
      //   } else {
      //     console.log(
      //       "The user",
      //       data.emailID,
      //       "found. Moving ahead with encrypting password and comparing that."
      //     );
      //     const passwordMatch = await encrypt.comparePassword(
      //       data.password,
      //       userObj.user.password
      //     );
      //     if (!passwordMatch) {
      //       returnMessage.success = false;
      //       returnMessage.status = "400";
      //       returnMessage.message = "Invalid credentials";
      //       return res.status(400).send(returnMessage);
      //     } else {
      //       //the user is a JSON object which contains _id, emailID, name, password, userDefinedCategories, cart, favourites, etc.
      //       //the password will be deleted and this user object will be embedded in the jwt.
      //       const user = JSON.parse(JSON.stringify(userObj.user));
      //       delete user.password;
      //       const token = jwt.sign(user, process.env.SECRET_KEY, {
      //         expiresIn: "24h",
      //       });
      //       returnMessage.user = user;
      //       returnMessage.token = token;
      //       returnMessage.success = true;
      //       returnMessage.status = 201;
      //       return res.status(201).send(returnMessage);
      //     }
      //   }
      // } catch (error) {
      //   console.log(
      //     "some error occured in loginController.js and the error is",
      //     error
      //   );
      //   res.status(500).json({ error: error });
      // }
    }
  }
};
