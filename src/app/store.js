// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/users/userSlice";
import productReducer from "../features/products/productSlice"; // Adjust the path as needed
import cartReducer from "../features/cart/cartSlice"; // Import cart reducer
import slideReducer from "../features/slides/slideSlice";
import dealReducer from "../features/deals/dealSlice";
import orderReducer from "../features/order/orderSlice";

export const store = configureStore({
  reducer: {
    auth: userReducer,
    products: productReducer,
    cart: cartReducer,
    slides: slideReducer,
    deals: dealReducer,
    order: orderReducer,
  },
});
