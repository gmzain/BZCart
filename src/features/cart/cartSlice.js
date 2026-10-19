import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://bzbackend.online/api";

// Utility function for retrying API calls
const retryRequest = async (requestFn, retries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await requestFn();
    } catch (err) {
      if (attempt === retries || err.code !== "ECONNABORTED") {
        throw err;
      }
      console.warn(
        `Retry attempt ${attempt} failed: ${err.message}. Retrying after ${delay}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ cartData, userId, token }, { rejectWithValue }) => {
    try {
      console.log("cartSlice - addToCart params:", { userId, token, cartData });

      if (!cartData.product_id || !cartData.selected_image) {
        console.error(
          "cartSlice - addToCart: Missing required fields",
          cartData
        );
        return rejectWithValue("Product ID and selected image are required");
      }

      const payload = {
        product_id: cartData.product_id,
        selected_image: cartData.selected_image,
        guestId: userId && token ? undefined : cartData.guestId,
        selected_size: cartData.selected_size || null,
      };

      console.log("cartSlice - addToCart payload:", payload);

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      console.log("cartSlice - addToCart headers:", headers);

      const response = await retryRequest(() =>
        axios.post(`${API_URL}/products/cart`, payload, {
          headers,
          timeout: 10000,
        })
      );
      console.log("cartSlice - addToCart response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "cartSlice - addToCart error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to add to cart"
      );
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ guestId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth?.user?._id;
      const token = auth?.token;
      console.log("cartSlice - fetchCart params:", { userId, guestId, token });

      if (!userId && !guestId) {
        console.error(
          "cartSlice - fetchCart: Neither userId nor guestId provided"
        );
        return rejectWithValue("User or guest ID required");
      }

      const query =
        userId && token ? "" : `?guestId=${encodeURIComponent(guestId)}`;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      console.log(
        "cartSlice - fetchCart URL:",
        `${API_URL}/products/cart${query}`
      );
      console.log("cartSlice - fetchCart headers:", headers);

      const response = await retryRequest(() =>
        axios.get(`${API_URL}/products/cart${query}`, {
          timeout: 10000,
          headers,
        })
      );
      console.log("cartSlice - fetchCart response:", response.data);
      return response.data;
    } catch (err) {
      console.error(
        "cartSlice - fetchCart error:",
        err.response?.data || err.message
      );
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch cart"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (
    { product_id, selected_image, guestId, selected_size, removeAll },
    { rejectWithValue, getState }
  ) => {
    try {
      const { auth } = getState();
      const userId = auth?.user?._id;
      const token = auth?.token;
      const payload = {
        product_id,
        selected_image,
        guestId: userId && token ? undefined : guestId,
        selected_size: selected_size || null,
        removeAll: removeAll || false,
      };

      console.log("cartSlice - removeFromCart payload:", payload);

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      console.log("cartSlice - removeFromCart headers:", headers);

      const response = await retryRequest(() =>
        axios.post(`${API_URL}/products/cart/remove`, payload, {
          timeout: 10000,
          headers,
        })
      );
      console.log("cartSlice - removeFromCart response:", response.data);
      return response.data;
    } catch (err) {
      console.error(
        "cartSlice - removeFromCart error:",
        err.response?.data || err.message
      );
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to remove item from cart"
      );
    }
  }
);

export const createOrder = createAsyncThunk(
  "cart/createOrder",
  async (orderData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth?.token;
      const headers = token
        ? {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        : { "Content-Type": "application/json" };
      console.log("cartSlice - createOrder headers:", headers);

      const response = await retryRequest(() =>
        axios.post(`${API_URL}/orders/create-order`, orderData, {
          timeout: 10000,
          headers,
        })
      );
      console.log("cartSlice - createOrder response:", response.data);
      localStorage.setItem("lastOrderId", response.data._id);
      return response.data;
    } catch (err) {
      console.error(
        "cartSlice - createOrder error:",
        err.response?.data || err.message
      );
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to create order"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
    orderLoading: false,
    orderError: null,
    orderSuccess: false,
    orderMessage: "",
    lastOrder: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.error = null;
    },
    resetOrderState: (state) => {
      state.orderLoading = false;
      state.orderError = null;
      state.orderSuccess = false;
      state.orderMessage = "";
      state.lastOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
        state.orderSuccess = false;
        state.orderMessage = "";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.orderSuccess = true;
        state.orderMessage = "Order placed successfully!";
        state.lastOrder = action.payload;
        state.items = [];
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderLoading = false;
        state.orderError = action.payload;
        state.orderMessage = action.payload;
      });
  },
});

export const { clearCart, resetOrderState } = cartSlice.actions;
export default cartSlice.reducer;
