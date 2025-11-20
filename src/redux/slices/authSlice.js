import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");
let parsedRole = null;
try {
  const rawRole = localStorage.getItem("role");
  parsedRole = rawRole ? JSON.parse(rawRole) : null;
} catch (e) {
  parsedRole = null;
}


//const role = localStorage.getItem("role");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!token,
    token: token || null,
    role: parsedRole,
  },
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.role = action.payload.role;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("role", JSON.stringify(action.payload.role));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.role = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
