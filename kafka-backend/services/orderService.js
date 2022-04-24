const ORDER = require("../db/models/orderModel");
const USER = require("../db/models/userModel");
const CONSTANTS = require("../constants.json")

class OrderService {
    static async addOrder(data, callback) {
        console.log("IN ADD ORDER SERVICE");
        const order = new ORDER(data);
        let { userID } = data;
        let query = { _id : userID };
        let newCart = { "cart": [] };
        await order
            .save()
            .then((res) => {
                console.log("ORDER ADDED", res);
                console.log("STARTING CLEAR CART:", query, newCart);
                USER.findOneAndUpdate(query, newCart, { upsert: true }).then(result => {
                    console.log("AFTER CLEARING CART", result)
                }, err => { throw err; })
                callback(null, res);
            })
            .catch((err) => {
                throw err;
            });
    }

    static async getOrdersbyQuery(data, callback) {
        console.log("IN GET ORDERSbyQuery SERVICE", data);
        const { userID } = data;
        let query = { userID };
        console.log("QUERY", query);
        await ORDER.find(query)
            .then((res) => {
                if (res.length > 0) {

                    console.log("ORDERS RECIEVED", res);

                } else {
                    res = "No result recieved. Q: " + query;
                }
                callback(null, res);
            })
            .catch((err) => {
                throw err;
            });
    }

}

function handle_request(msg, callback) {
    console.log("IN HANDLE REQ");
    if (msg.function === "addOrder") {
        OrderService.addOrder(msg.data, callback);
    } else if (msg.function === "getOrdersbyQuery") {
        OrderService.getOrdersbyQuery(msg.data, callback);
    }
}

exports.handle_request = handle_request;