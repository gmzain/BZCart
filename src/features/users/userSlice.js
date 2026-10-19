import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logUser, regUser, verifyOTP, logout } from "./userService";
import axios from "axios";

const isUser = JSON.parse(localStorage.getItem("myUser"));
const isTempUser = JSON.parse(localStorage.getItem("tempUser"));

const initialState = {
  user: isUser ? isUser : null,
  tempUser: isTempUser ? isTempUser : null,
  token: isUser ? isUser.token : null,
  userLoading: false,
  userMessage: "",
  userError: false,
  userSuccess: false,
};

export const registerMyUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      console.log("userSlice - registerMyUser: Attempting registration with:", { email: data.email });
      const response = await regUser(data);
      console.log("userSlice - registerMyUser: Success, tempUser:", response._id);
      localStorage.setItem("tempUser", JSON.stringify(response));
      return response;
    } catch (error) {
      console.error("userSlice - registerMyUser: Error:", error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

export const loginMyUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      console.log("userSlice - loginMyUser: Attempting login with:", { email: data.email });
      const response = await logUser(data);
      console.log("userSlice - loginMyUser: Success, user:", response._id);
      localStorage.setItem("myUser", JSON.stringify(response));
      return response;
    } catch (error) {
      console.error("userSlice - loginMyUser: Error:", error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const verifyOTPData = createAsyncThunk(
  "auth/verifyOTP",
  async (otpData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.tempUser?.token;
      if (!token) {
        console.error("userSlice - verifyOTPData: No temporary user token found");
        throw new Error("No temporary user token found");
      }
      console.log("userSlice - verifyOTPData: Verifying OTP with token:", token.substring(0, 10) + "...");
      const response = await verifyOTP(otpData, token);
      console.log("userSlice - verifyOTPData: Success, user:", response._id);
      localStorage.setItem("myUser", JSON.stringify(response));
      localStorage.removeItem("tempUser");
      return response;
    } catch (error) {
      console.error("userSlice - verifyOTPData: Error:", error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("myUser"));
      const token = storedUser?.token;
      if (!token) {
        console.log("userSlice - checkAuthStatus: No token found");
        return null;
      }
      console.log("userSlice - checkAuthStatus: Checking auth with token:", token.substring(0, 10) + "...");
      const response = await axios.get("http://localhost:3003/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });
      console.log("userSlice - checkAuthStatus: Success, user:", response.data._id);
      return { ...response.data, token };
    } catch (error) {
      console.error("userSlice - checkAuthStatus: Error:", error.response?.data?.message || error.message);
      localStorage.removeItem("myUser");
      return rejectWithValue(null);
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  console.log("userSlice - logoutUser: Logging out");
  await logout();
  localStorage.removeItem("myUser");
  localStorage.removeItem("tempUser");
  return null;
});

export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userReset: (state) => {
      state.userLoading = false;
      state.userError = false;
      state.userSuccess = false;
      state.userMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerMyUser.pending, (state) => {
        state.userLoading = true;
        state.userError = false;
        state.userSuccess = false;
        state.userMessage = "";
        console.log("userSlice - registerMyUser: Pending");
      })
      .addCase(registerMyUser.fulfilled, (state, action) => {
        state.userLoading = false;
        state.userSuccess = true;
        state.tempUser = action.payload;
        state.token = action.payload.token;
        state.userError = false;
        state.userMessage = "";
        console.log("userSlice - registerMyUser: Fulfilled, tempUser set");
      })
      .addCase(registerMyUser.rejected, (state, action) => {
        state.userLoading = false;
        state.userError = true;
        state.userMessage = action.payload;
        state.userSuccess = false;
        console.log("userSlice - registerMyUser: Rejected, error:", action.payload);
      })
      .addCase(loginMyUser.pending, (state) => {
        state.userLoading = true;
        state.userError = false;
        state.userSuccess = false;
        state.userMessage = "";
        console.log("userSlice - loginMyUser: Pending");
      })
      .addCase(loginMyUser.fulfilled, (state, action) => {
        state.userLoading = false;
        state.userSuccess = true;
        state.user = action.payload;
        state.token = action.payload.token;
        state.tempUser = null;
        state.userError = false;
        state.userMessage = "";
        console.log("userSlice - loginMyUser: Fulfilled, user set");
      })
      .addCase(loginMyUser.rejected, (state, action) => {
        state.userLoading = false;
        state.userError = true;
        state.userMessage = action.payload;
        state.userSuccess = false;
        console.log("userSlice - loginMyUser: Rejected, error:", action.payload);
      })
      .addCase(verifyOTPData.pending, (state) => {
        state.userLoading = true;
        state.userError = false;
        state.userSuccess = false;
        state.userMessage = "";
        console.log("userSlice - verifyOTPData: Pending");
      })
      .addCase(verifyOTPData.fulfilled, (state, action) => {
        state.userLoading = false;
        state.userSuccess = true;
        state.user = action.payload;
        state.token = action.payload.token;
        state.tempUser = null;
        state.userError = false;
        state.userMessage = "";
        console.log("userSlice - verifyOTPData: Fulfilled, user set");
      })
      .addCase(verifyOTPData.rejected, (state, action) => {
        state.userLoading = false;
        state.userError = true;
        state.userMessage = action.payload;
        state.userSuccess = false;
        console.log("userSlice - verifyOTPData: Rejected, error:", action.payload);
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.userLoading = true;
        state.userError = false;
        state.userSuccess = false;
        state.userMessage = "";
        console.log("userSlice - checkAuthStatus: Pending");
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.userLoading = false;
        state.userSuccess = action.payload ? true : false;
        state.user = action.payload;
        state.token = action.payload?.token || null;
        state.tempUser = null;
        state.userError = false;
        state.userMessage = action.payload ? "User authenticated" : "";
        console.log("userSlice - checkAuthStatus: Fulfilled, user:", action.payload ? "set" : "null");
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.userLoading = false;
        state.userError = true;
        state.userMessage = action.payload || "Failed to check auth status";
        state.userSuccess = false;
        state.user = null;
        state.token = null;
        state.tempUser = null;
        console.log("userSlice - checkAuthStatus: Rejected, error:", action.payload);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.tempUser = null;
        state.userSuccess = false;
        state.userError = false;
        state.userMessage = "";
        console.log("userSlice - logoutUser: Fulfilled, state cleared");
      });
  },
});

export const { userReset } = userSlice.actions;
export default userSlice.reducer;