import React from "react";
import CartItem from "./CartItem";

function CartHelper({ items_list }) {
  console.log("the props in the cart helper are", items_list);
  const items_list_cards = items_list.map((item) => {
    console.log(item.name, item.quantity);
    let props = {
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    };
    return <CartItem key={item._id} {...props} />;
  });
  return (
    <div>
      <section>{items_list_cards}</section>
    </div>
  );
}

export default CartHelper;
