import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Snackbar,
} from "@mui/material";

const AddUserDrawer = ({ open, setOpen }) => {
  const [formData, setFormData] = useState({ username: "", password: "", role: "" });
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // Reset form whenever the drawer opens
  useEffect(() => {
    if (open) {
      setFormData({ username: "", password: "", role: "" });
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!formData.username.trim()) {
      setSnackbar({ open: true, message: "Username is required" });
      return;
    }
    if (!formData.password.trim()) {
      setSnackbar({ open: true, message: "Password is required" });
      return;
    }
    if (!formData.role) {
      setSnackbar({ open: true, message: "Role is required" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Request failed: ${res.status}`);
      }

      // Notify success and close
      setSnackbar({ open: true, message: "User created!" });
      setOpen(false);

      // Let other components know a user was added
      window.dispatchEvent(new Event("user-added"));
    } catch (err) {
      console.error("Failed to save user", err);
      setSnackbar({ open: true, message: "Failed to create user" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ username: "", password: "", role: "" });
    setOpen(false);
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={handleClose}>
        <Box sx={{ width: 360, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add User
          </Typography>

          <TextField
            label="Username"
            fullWidth
            margin="normal"
            autoComplete="off"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            autoComplete="new-password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="">Select Role</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="INVENTORY_MANAGER">INVENTORY_MANAGER</MenuItem>
              <MenuItem value="SALES_EXECUTIVE">SALES_EXECUTIVE</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={18} /> : null}
            >
              {submitting ? "Saving..." : "Save User"}
            </Button>

            <Button variant="outlined" fullWidth onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
      />
    </>
  );
};

export default AddUserDrawer;