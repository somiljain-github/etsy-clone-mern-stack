import { LOG_IN, LOG_OUT } from "./action-types.js";

const initialState = {
  user: {},
};
function rootReducer(state = initialState, action) {
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
  if (action.type === LOG_OUT) {
    console.log("removing user...");
    console.log(
      "the payload is ",
      action.payload,
      " and the current state is ",
      state
    );
    const updated_state = Object.assign({}, state, {
      user: {},
    });
    console.log("the updated state is ", updated_state);
    return updated_state;
  }
  return state;
}

export default rootReducer;
