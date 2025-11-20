import React, { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Button, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, TextField, InputAdornment, Snackbar, Alert,MenuItem
} from "@mui/material";
import { Add, Edit, Delete, Search } from "@mui/icons-material";
import apiClient from "../../api/axiosClient";
import ProductDrawer from "./ProductDrawer";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [snackbar, setSnackbar] = useState({ open:false, message:"", severity:"success" });
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    loadCategories();
    loadProducts();
    loadSupplier();
    // eslint-disable-next-line
  }, [page, size]);

  useEffect(() => {
    const t = setTimeout(() => loadProducts(0), 400); // debounce search
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [search, categoryFilter]);

  const loadCategories = async () => {
    try {
      const res = await apiClient.get("/category");
      setCategories(res.data.data);
    } catch (e) { console.error(e); }
  };

  const loadSupplier = async () => {
    try {
      const res = await apiClient.get("/supplier");
      setSuppliers(res.data.data);
    } catch (e) { console.error(e); }
  };

  const loadProducts = async (pageToLoad = page) => {
    setLoading(true);
    try {
      const params = {
        page: pageToLoad,
        size,
        search: search || undefined,
        categoryId: categoryFilter ? Number(categoryFilter) : undefined,
        sort: "name,asc"
      };
      const res = await apiClient.get("/products", { params });
      // expect paged response: { content: [], totalElements, number }
      setProducts(res.data.content || res.data.data);
      setTotal(res.data.totalElements ?? (res.data.length || 0));
      setPage(res.data.number ?? pageToLoad);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
    loadProducts(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setSize(parseInt(e.target.value,10));
    setPage(0);
    loadProducts(0);
  };

  const openAdd = () => {
    setDrawerMode("add");
    setSelectedProduct(null);
    setDrawerOpen(true);
  };
  const openEdit = (p) => {
    setDrawerMode("edit");
    setSelectedProduct(p);
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await apiClient.delete(`/products/product/${id}`);
      setSnackbar({ open:true, message:"Product deleted", severity:"success" });
      loadProducts();
    } catch (err) {
      setSnackbar({ open:true, message: err.response?.data?.message || "Delete failed", severity:"error" });
    }
  };

  const handleDrawerSubmit = (response) => {
    if (response && response.error) {
      setSnackbar({ open:true, message: response.error, severity:"error" });
    } else {
      setSnackbar({ open:true, message: drawerMode==="add" ? "Product created" : "Product updated", severity:"success" });
      setDrawerOpen(false);
      loadProducts(0);
    }
  };

  return (
    <Box sx={{ p:3 }}>
      <Typography variant="h5" fontWeight="700" mb={2}>Products</Typography>

      <Card>
        <CardContent>
          <Box sx={{ display:"flex", justifyContent:"space-between", mb:2 }}>
            <Box sx={{ display:"flex", gap:2 }}>
              <TextField
                size="small"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search /></InputAdornment>
                }}
              />

            <TextField
                select
                size="small"
                value={categoryFilter}
                onChange={(e)=> { setCategoryFilter(e.target.value) }}
                sx={{ minWidth: 200 }}
                label="Category"
                >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map(c => (
                    <MenuItem key={c.id} value={c.id}>
                    {c.categoryName || c.name}
                    </MenuItem>
                ))}
            </TextField>
            </Box>

            <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Add Product</Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Code</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Supplier</strong></TableCell>
                  <TableCell><strong>Stock</strong></TableCell>
                  <TableCell><strong>Cost Price</strong></TableCell>
                  <TableCell><strong>Selling Price</strong></TableCell>
                  <TableCell><strong>ReorderLevel</strong></TableCell>
                  <TableCell><strong>Created At</strong></TableCell>
                  <TableCell><strong>Updated At</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {products.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.code}</TableCell>
                    <TableCell>{p.category?.categoryName || p.category?.name}</TableCell>
                    <TableCell>{p.supplier?.supplierName || p.supplier?.name}</TableCell>
                    <TableCell>{p.stockQuantity ?? p.stock}</TableCell>
                    <TableCell>₹{p.costPrice}</TableCell>
                    <TableCell>₹{p.sellingPrice}</TableCell>
                    <TableCell>{p.reorderLevel}</TableCell>
                    <TableCell>{p.createdAt}</TableCell>
                    <TableCell>{p.updatedAt}</TableCell>
                    <TableCell>
                      <IconButton onClick={()=>openEdit(p)}><Edit /></IconButton>
                      <IconButton color="error" onClick={()=>handleDelete(p.id)}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No products found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={size}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5,10,20,50]}
          />
        </CardContent>
      </Card>

      <ProductDrawer
        open={drawerOpen}
        onClose={()=>setDrawerOpen(false)}
        mode={drawerMode}
        initialData={selectedProduct}
        onSubmit={handleDrawerSubmit}
      />

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={()=>setSnackbar({...snackbar, open:false})}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductList;
