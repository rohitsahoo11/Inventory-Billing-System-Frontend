import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
} from "@mui/material";

import { Add, Edit, Delete } from "@mui/icons-material";
import apiClient from "../../api/axiosClient";

import CategoryDrawer from "./CategoryDrawer";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add"); // add | edit
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load categories
  const loadCategories = async () => {
    try {
      const res = await apiClient.get("/category");
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Open Add Drawer
  const handleAdd = () => {
    setDrawerMode("add");
    setSelectedCategory(null);
    setDrawerOpen(true);
  };

  // Open Edit Drawer
  const handleEdit = (cat) => {
    setDrawerMode("edit");
    setSelectedCategory(cat);
    setDrawerOpen(true);
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this category?")) return;

    try {
      await apiClient.delete(`/category/${id}`);
      loadCategories();
      setSnackbar({
        open: true,
        message: "Category deleted successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message ||
          "Cannot delete category. It may be linked with products.",
        severity: "error",
      });
    }
  };

  // Add/Edit Submit
  const handleDrawerSubmit = async (formData) => {
    try {
      if (drawerMode === "add") {
        await apiClient.post("/category", formData);
        setSnackbar({
          open: true,
          message: "Category added successfully!",
          severity: "success",
        });
      } else {
        await apiClient.put(
          `/category/${selectedCategory.id}`,
          formData
        );
        setSnackbar({
          open: true,
          message: "Category updated successfully!",
          severity: "success",
        });
      }

      setDrawerOpen(false);
      loadCategories();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Something went wrong!",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Categories
      </Typography>

      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6">Category List</Typography>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAdd}
            >
              Add Category
            </Button>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Category Name</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>{cat.id}</TableCell>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>{cat.description}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(cat)}
                      >
                        <Edit />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {categories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No categories found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Drawer Component */}
      <CategoryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        mode={drawerMode}
        initialData={selectedCategory}
        onSubmit={handleDrawerSubmit}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoryList;
