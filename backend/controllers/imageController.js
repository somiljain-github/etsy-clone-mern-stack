const { uploadFile, getFileStream } = require("../config/s3.config.js");

module.exports = class imageController {
  static async uploadDp(req, res) {
    const file = req.file;
    let response = {};

    if (file) {
      try {
        const result = await uploadFile(file);
        console.log(result);
        response.key = result.key;
        res
          .status(200)
          .send(response)
          .end();
      } catch (e) {
        res.statusMessage = "Something went wrong. Details: " + e;
        res.sendStatus(500).end();
      }
    } else {
      res.status(400).send({
        status: false,
        data: "No file is selected.",
      });
    }
  }

  static async getDp(req, res) {
    const key = req.params.key;
    if (key) {
      try {
        const readStream = getFileStream(key);
        readStream.pipe(res);
      } catch (e) {
        res.statusMessage = "Something went wrong. Details: " + e;
        res.sendStatus(500).end();
      }
    } else {
      res.status(400).send({
        status: false,
        data: "No key sent.",
      });
    }
  }
};
