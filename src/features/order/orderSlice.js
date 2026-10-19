import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/axios";

const API_URL = "https://bzbackend.online/api";

export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async ({ guestId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      let url = "/orders/my-orders";
      let params = {};
      // For guest users, add guestId to query params
      if (!auth.user && guestId) {
        params.guestId = guestId;
      }
      // For logged in users, the token will be sent automatically by axios interceptor
      console.log("fetchMyOrders - Requesting:", { url, params });
      const response = await api.get(url, { params });
      console.log("fetchMyOrders - Response data:", response.data);
      return response.data;
    } catch (err) {
      console.error("fetchMyOrders error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
