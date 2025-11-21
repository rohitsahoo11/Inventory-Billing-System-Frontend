import React, { useState } from "react";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UserTable from "./UserTable";
// Use the MUI drawer component you implemented earlier
import UserFromDrawer from "./UserFormDrawer";

const UserList = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 4 }}>
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            User Management
          </Typography>

          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => setOpenDrawer(true)}
            sx={{ textTransform: "none" }}
          >
            Add User
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={1} sx={{ p: 2 }}>
          <UserTable />
        </Paper>
      </Container>

      <UserFromDrawer open={openDrawer} setOpen={setOpenDrawer} />
    </Box>
  );
};

export default UserList;