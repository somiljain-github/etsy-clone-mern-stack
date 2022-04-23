const constants = require("../constants.json");
const { uploadFile, getFileStream } = require("../config/s3.config.js");
const kafka = require("../kafka/client");

module.exports = class orderController {
    static async addOrder(req, res) {
        const order = req.body;
        console.log("ORDER RECIEVED", order);
        try {
            let message = { function: "addOrder", data: order };
            kafka.make_request(
                "topic-order-add-order",
                message,
                async (err, result) => {
                    if (err && res.headersSent !== true) {
                        console.error(err);
                        return res.json({
                            status: "Error",
                            msg: "System error, try again",
                        });
                    } else {
                        console.log(
                            "the result recieved in orderController.addOrder is",
                            result
                        );
                        res.statusMessage = "ORDER CREATED";
                        res.sendStatus(200).end();
                    }
                }
            );
        } catch (e) {
            console.log(e);
            res.statusMessage = e;
            res.sendStatus(500);
        }
    }

    static async getOrders(req, res) {
        const {userID} = req.params;
        const {page, pageSize} = req.query;
        let startIdx = (page -1) * pageSize;
        let endIdx = page * pageSize;
        console.log("StartIdx: ", startIdx, "EndIdx", endIdx);
        console.log("DATA RECIEVED", userID, page, pageSize);
        try {
            let message = { function: "getOrdersbyQuery", data: {userID} };
            kafka.make_request(
                "topic-order-get-orders",
                message,
                async (err, result) => {
                    if (err && res.headersSent !== true) {
                        console.error(err);
                        return res.json({
                            status: "Error",
                            msg: "System error, try again",
                        });
                    } else {
                        console.log(
                            "the result recieved in orderController.getOrder is",
                            result
                        );
                        res.statusMessage = "ORDERS RECIEVED";
                        res.send(result.slice(startIdx, endIdx));
                        res.status(200).end();
                    }
                }
            );
        } catch (e) {
            console.log(e);
            res.statusMessage = e;
            res.sendStatus(500);
        }
    }
}