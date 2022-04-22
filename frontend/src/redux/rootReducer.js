import { LOG_IN, LOG_OUT, SET_ITEMS, GET_CURRENCIES } from "./action-types.js";

const initialState = {
  user: {},
  dummyData: "dummy string",
  items: [],
  currencies: [],
};
function rootReducer(state = initialState, action) {
  //==========================LOG_IN==========================
  if (action.type === LOG_IN) {
    console.log("adding user...");
    console.log(
      "the payload is ",
      action.payload,
      " and the current state is ",
      state
    );
    const updated_state = Object.assign({}, state, {
      user: action.payload,
    });
    console.log("the updated state is ", updated_state);
    return updated_state;
  }
  //==========================LOG_OUT==========================
  if (action.type === LOG_OUT) {
    console.log("removing user...");
    console.log(
      "the payload is ",
      action.payload,
      " and the current state is ",
      state
    );
    console.log("the updated state is ", initialState);
    return initialState;
  }
  //==========================SET_ITEMS==========================
  if (action.type === SET_ITEMS) {
    console.log("setting items in the rootReducer...");
    console.log(
      "the payload is ",
      action.payload,
      " and the current state is ",
      state
    );
    const updated_state = Object.assign({}, state, {
      items: action.payload,
    });
    console.log("the updated state is ", updated_state);
    return updated_state;
  }
  //==========================GET_CURRENCIES==========================
  if (action.type === GET_CURRENCIES) {
    console.log("setting items in the rootReducer...");
    console.log(
      "the payload is ",
      action.payload,
      " and the current state is ",
      state
    );
    const updated_state = Object.assign({}, state, {
      currencies: action.payload,
    });
    console.log("the updated state is ", updated_state);
    return updated_state;
  }
  //==========================Return state by default==========================
  return state;
}

export default rootReducer;
