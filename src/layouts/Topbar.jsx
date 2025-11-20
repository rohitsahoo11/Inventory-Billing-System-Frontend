import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Box,
  Divider,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Bell, Search, User, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const SearchBox = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "4px 12px",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[100],
  width: 300,
}));

const Topbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { username, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppBar position="static" elevation={1} sx={{ backgroundColor: "#fff", color: "#333" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Search Bar */}
        <SearchBox elevation={0}>
          <Search size={18} style={{ marginRight: 8, color: "#666" }} />
          <InputBase
            placeholder="Search products, sales..."
            fullWidth
            sx={{ fontSize: 14 }}
          />
        </SearchBox>

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton>
            <Bell size={22} />
          </IconButton>

          <Box onClick={handleMenuOpen} sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <User size={22} />
            <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
              {username}
            </Typography>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ elevation: 3 }}
          >
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {role}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogOut size={16} style={{ marginRight: 8 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;