import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Typography,
  CircularProgress,
  Snackbar,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8080/api/users");
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.data;
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load users", err);
      setUsers([]);
      setSnackbar({ open: true, message: "Failed to load users" });
    }
  }, []);

  useEffect(() => {
    fetchUsers();

    // Optional: listen for a custom event to refresh the list after adding a user
    const onUserAdded = () => fetchUsers();
    window.addEventListener("user-added", onUserAdded);
    return () => window.removeEventListener("user-added", onUserAdded);
  }, [fetchUsers]);

  const setLoading = (id, value) => {
    setLoadingIds((prev) => {
      const next = new Set(prev);
      if (value) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleActive = async (user) => {
    const isActivating = !Boolean(user.active);
    const url = `http://localhost:8080/api/users/user/${user.id}/${isActivating ? "active" : "deactive"}`;

    const prev = [...users];
    setUsers((arr) => arr.map((u) => (u.id === user.id ? { ...u, active: isActivating } : u)));
    setLoading(user.id, true);

    try {
      const res = await fetch(url, { method: "PUT" });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      setSnackbar({ open: true, message: `User ${isActivating ? "activated" : "deactivated"}` });
      // Optionally re-fetch to ensure server state: await fetchUsers();
    } catch (err) {
      console.error("Toggle failed", err);
      setUsers(prev); // rollback
      setSnackbar({ open: true, message: "Failed to update user status" });
    } finally {
      setLoading(user.id, false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Users
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small" aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Username</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((u) => {
                const isLoading = loadingIds.has(u.id);
                return (
                  <TableRow key={u.id} hover>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: 13,
                          bgcolor: u.active ? "success.light" : "error.light",
                          color: u.active ? "success.dark" : "error.dark",
                        }}
                      >
                        {u.active ? "Active" : "Inactive"}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="inline-flex" alignItems="center" gap={1}>
                        <Switch
                          checked={Boolean(u.active)}
                          onChange={() => toggleActive(u)}
                          disabled={isLoading}
                          color="primary"
                          inputProps={{ "aria-label": `toggle-active-${u.id}` }}
                        />
                        {isLoading && <CircularProgress size={18} />}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No users found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
        action={
          <IconButton size="small" color="inherit" onClick={() => setSnackbar({ open: false, message: "" })}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default UserTable;