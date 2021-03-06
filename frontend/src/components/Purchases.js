import React, { useState, useEffect } from "react";
import { Form } from 'react-bootstrap';
import Navbar from "./Navbar";
import axios from "axios";
import { constants } from "../config/config";
import authHeader from "../services/authHeader";
import '../styles/Purchases.css';
import { PaginatedList } from 'react-paginated-list';

function Purchases() {
  const userID = localStorage.getItem("userID");
  var [purchases, setPurchases] = useState([]);
  var [pageSize, setPageSize] = useState([]);
  var [i, setI] = useState([]);
//   const userID = '625128a2ad676dcca6e551bf';
//   const userID = '6265b530330f388a15e0926d';
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

      pageSize = 5;
      setPageSize(pageSize)
    
      i = 0;
      setI(0);

    //   console.log('@#@@@@@@@@@', i, pageSize)

  }, []);

  console.log('$#$# purchases: ', purchases);
//   let i = 0;
//   const purchase_cards = {
//     return(purchases)}
      //purchases.map((purchase) => {
      
        // console.log('#####$$$$$ ', purchase, ' | i = ', i)

        // i += 1

        // let item_no = 0
        // const items = purchase.items.map((item) => {
        //     item_no += 1
        //     return (
        //         <div className="item-card" key={JSON.stringify(item) + item_no}>
        //             <p><span className="item-head">Item {item_no}</span> <span className="item_id_top_right">{item.itemID}</span></p>

        //             <div key={JSON.stringify(item)} className="item-inner-box">
        //                 <div className="row">
        //                     <div className="col-md-8 item-left-box">
        //                         {/* <div>{JSON.stringify(item)}</div> */}
        //                         <p>Qty: {item.quantity}</p>
        //                         <p>{item.isGiftPack ? <p>Gift wrapped!</p> : ''}</p>
        //                     </div>
        //                     <div className="col-md-4 item-right-box">
        //                         {/* image container */}
        //                         <p>test</p>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     )
        // })
        // return (
        //     <div className="purchase-card">
        //         <p>Purchase {i}</p>
        //         <br/>
        //         {items}
        //     </div>
        // )
  //});

//   i = 0;


  let componentToRender = (
      <div>
          <Navbar />
          <p>No Purchases!</p>
      </div>
  )

  if (purchases) {
      console.log('Purchases not null', purchases);
  } else {
      console.log('Purchases null', purchases);
  }

  if (purchases) {
    componentToRender = (
        <div>
            <Navbar />
            <div className="container">
                <div>Purchases</div>

                <Form.Select size="sm" className="sort-filter" onChange={(e)=>{setPageSize(parseInt(e.target.value))}} id="sort-homeitem" name="sort-homeitem">
                    <option value="2">2</option>
                    <option selected value="5">5</option>
                    <option value="10">10</option>
                </Form.Select>

                <PaginatedList
                    list={purchases}
                    itemsPerPage={pageSize}
                    renderList={(purchases) => (purchases.map(purchase =>(<>{
                        <div className="purchase-card" key={JSON.stringify(purchase)}>
                            <p> <span className="item_id_top_right"><b>Purchase Id:</b> {purchase._id}</span></p>
                            <br/>
                            {
                                (purchase.items.map(item =>(<>
                                {/* {console.log(item)} */}
                                    <div className="item-card" key={JSON.stringify(item)}>
                                        <p><span className="item-head">{item.name}</span> <span className="item_id_top_right">{item.itemID}</span></p>

                                        <div key={JSON.stringify(item)} className="item-inner-box">
                                            <div className="row">
                                                <div className="col-md-8 item-left-box">
                                                    {/* <div>{JSON.stringify(item)}</div> */}
                                                    <p>Price: {item.price}</p>
                                                    <p>Qty: {item.quantity}</p>
                                                    <p>Date: {item.dop}</p>
                                                    <p>{item.isGiftPack ? <div><p>Gift wrapped!</p> <p className="gift-wrap-instructions">{item.instructions}</p></div>  : ''}</p>
                                                    <p>Shop name: {item.shopName}</p>
                                                </div>
                                                <div className="col-md-4 item-right-box">
                                                    {/* image container */}
                                                    {/* <p>test</p> */}
                                                    {/* <img src="simple-necklace-designs-in-gold-10.jpg" className="item-image" /> */}
                                                    <img src={item.displayPicture} className="item-image" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>)))
                            }
                        </div>
                    }</>)))}
                ></PaginatedList>
            </div>
        </div>
    )
  }

  console.log(componentToRender);

  return (
    <div>
        {componentToRender}
    </div>
  )
}

export default Purchases;