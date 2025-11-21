import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slices/authSlice";
import apiClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await apiClient.post("/auth/login", { username, password });

      const { status, message, data } = response.data;


      const token = data.token;
      const role = data.role;

      dispatch(loginSuccess({ token, role }));

      if (role === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (role === "INVENTORY_MANAGER") {
      navigate("/inventory/dashboard");
    } else if (role === "SALES_EXECUTIVE") {
      navigate("/sales");
    } else {
      navigate("/");
    }
  } catch (err) {
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }

  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f5f6fa" }}>
      {/* Left Image Section */}
      <Box
        sx={{
          flex: 1,
          backgroundImage:
            "url('https://plus.unsplash.com/premium_photo-1682146441726-cb29b01c2207?q=80&w=1170&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: { xs: "none", md: "block" },
        }}
      />

      {/* Right Form Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 3,
        }}
      >
        <Card sx={{ width: "100%", maxWidth: 420, borderRadius: 3, boxShadow: 6 }}>
          <CardContent>
            <Typography variant="h5" fontWeight={700} align="center" mb={3}>
              Inventory Login
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />

            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3, textTransform: "none", fontSize: 16 }}
              onClick={handleLogin}
              disabled={loading || !username || !password}
              endIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;