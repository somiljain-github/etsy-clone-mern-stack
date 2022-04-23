const ORDER = require("../db/models/orderModel");

class OrderService {
    static async addOrder(data, callback) {
        console.log("IN ADD ORDER SERVICE");
        const order = new ORDER(data);
        await order
            .save()
            .then((res) => {
                console.log("ORDER ADDED", res);
                callback(null, res);
            })
            .catch((err) => {
                throw err;
            });
    }

    static async getOrdersbyQuery(data, callback) {
        console.log("IN GET ORDERSbyQuery SERVICE", data);
        const { userID } = data;
        const query = { userID };
        console.log("QUERY", query);
        await ORDER.find(query)
            .then((res) => {
                if (res.length > 0) {
                    console.log("ORDERS RECIEVED", res);
                    
                }else{
                    res = "No result recieved. Q: "+ query;
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