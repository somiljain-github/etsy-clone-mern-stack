// const ITEM = require("../models/itemModel");
// module.exports = class ItemService {
//   static async addItem(data) {
//     const item = new ITEM(data);
//     await item
//       .save()
//       .then((res) => {
//         console.log("ITEM ADDED");
//       })
//       .catch((err) => {
//         throw err;
//       });
//   }

//   static async updateItem(data) {
//     let _id = data.itemId;
//     await ITEM.findOneAndUpdate({ _id }, data).then((res) => {
//       console.log(res);
//       if (res) console.log("ITEM ADDED");
//       else throw "Item NOT updated. Result: " + res;
//     });
//   }

//   static async getItemsbyParamter(param, val) {
//     const query = { [param]: val };
//     console.log(query);
//     let itemObj = {};
//     return new Promise(function(resolve, reject) {
//       ITEM.find(query)
//         .lean()
//         .then((res) => {
//           //console.log("ITEMS returned : ", res);
//           if (res) {
//             console.log(res.length, "ITEMS LOADED");
//             itemObj = res;
//             resolve(itemObj);
//           } else {
//             reject("Item NOT loaded. Result: " + res);
//           }
//         })
//         .catch((err) => {
//           throw err;
//         });
//     });
//   }

//   static async markFavourteItems(items, favIds) {
//     items.forEach((item, index) => {
//       const found = favIds.some((id) => {
//         return id === item._id;
//       });
//       // console.log(found);
//       item.favourited = found ? true : false;
//     });
//     return items;
//   }
// };
