import axios from "axios";

const API_URL = "https://bzbackend.online/api/users";

export const regUser = async (data) => {
  const response = await axios.post(`${API_URL}/register-user`, data);

  if (response.data) {
    localStorage.setItem("tempUser", JSON.stringify(response.data)); // Store temporary user data
  }

  return response.data;
};

export const logUser = async (data) => {
  const response = await axios.post(`${API_URL}/login-user`, data);

  if (response.data) {
    localStorage.setItem("myUser", JSON.stringify(response.data)); // Store permanent user data
  }

  return response.data;
};

export const logout = async () => {
  localStorage.removeItem("myUser");
  localStorage.removeItem("tempUser"); // Clear temporary user data
};

export const verifyOTP = async (otpData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${API_URL}/verify-otp`, otpData, config);

  if (response.data) {
    localStorage.removeItem("tempUser"); // Remove temporary user data
    localStorage.setItem("myUser", JSON.stringify(response.data)); // Store permanent user data
  }

  return response.data;
};
