import React from "react";
import CartItem from "./CartItem";

function CartHelper({ items_list }) {
  console.log("the props in the cart helper are", items_list);
  const items_list_cards = items_list.map((item) => {
    // console.log("the item is ", item);

    let props = {
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    };
    // console.log("the props to be sent are", props);

    // key={item.itemID}
    return <CartItem key={item.itemid} {...props} />;
  });
  return (
    <div>
      <section>{items_list_cards}</section>
    </div>
  );
}

export default CartHelper;
