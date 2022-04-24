import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { constants } from "../config/config";
import authHeader from "../services/authHeader";
import '../styles/Purchases.css'

function Purchases() {
  //const userID = localStorage.getItem("userID");
  var [purchases, setPurchases] = useState([]);
  const userID = '625128a2ad676dcca6e551bf';
  const URL = `http://${constants.IP.ipAddress}:3001/api/v1/order/getOrders/${userID}`;
  console.log(URL);

  useEffect(() => {
    axios.get(URL, {headers: authHeader()}, { params: {page: 1, pageSize: 1} } )
      .then((response) => {
        console.log("Purchases responses: ", response);
        console.log('Purchases response.data: ', response.data);
        if (response.status === 200) {

            console.log('Console log code 200.');

            const jsonResp = response.data;
            console.log('JSON response: ', jsonResp);

            purchases = response.data;
            setPurchases(purchases);

        } else {
            console.log('Response code not 200');
        }
      })
      .catch((err) => {
        console.log("error in getting all items in the home page", err);
      });
  }, []);

  console.log('$#$# purchases: ', purchases);
  let i = 0;
  const purchase_cards = purchases.map((purchase) => {
      
        console.log('#####$$$$$ ', purchase, ' | i = ', i)

        i += 1

        let item_no = 0
        const items = purchase.items.map((item) => {
            
            item_no += 1
            return (
                <div className="item-card" key={JSON.stringify(item) + item_no}>
                    <p><span className="item-head">Item {item_no}</span> <span className="item_id_top_right">{item.itemID}</span></p>

                    <div key={JSON.stringify(item)} className="item-inner-box">
                        <div className="row">
                            <div className="col-md-8 item-left-box">
                                {/* <div>{JSON.stringify(item)}</div> */}
                                <p>Qty: {item.quantity}</p>
                                <p>{item.isGiftPack ? <p>Gift wrapped!</p> : ''}</p>
                            </div>
                            <div className="col-md-4 item-right-box">
                                {/* image container */}
                                <p>test</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
        
        return (
            <div className="purchase-card">
                <p>Purchase {i}</p>
                <br/>
                {items}
            </div>
        )
  });

  return (
    <div>
        <Navbar />
        <div className="container">
            <div>Purchases</div>
            <div>
                {purchase_cards}
            </div>
        </div>
    </div>
  )
}

export default Purchases;