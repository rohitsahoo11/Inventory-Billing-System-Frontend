import React, { useEffect, useState } from "react";
import {
  Drawer, Box, Typography, TextField, Divider, Button, MenuItem, FormControl, InputLabel, Select
} from "@mui/material";
import axiosClient from "../../api/axiosClient";
import apiClient from "../../api/axiosClient";

const ProductDrawer = ({ open, onClose, mode, initialData, onSubmit }) => {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    code: "",
    categoryId: "",
    supplierId: "",
    costPrice: "",
    sellingPrice: "",
    stockQuantity: "",
    reorderLevel: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    // load categories for dropdown
    const loadCats = async () => {
      try {
        const res = await apiClient.get("/category");
        setCategories(res.data.data);
      } catch (e) { console.error(e); }
    };
    loadCats();
  }, []);

  useEffect(() => {
    // load categories for dropdown
    const loadSupp = async () => {
      try {
        const res = await apiClient.get("/supplier");
        setSuppliers(res.data.data);
      } catch (e) { console.error(e); }
    };
    loadSupp();
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        code: initialData.code || "",
        categoryId: initialData.category?.id || "",
        supplierId: initialData.supplier?.id || "",
        costPrice: initialData.costPrice || "",
        sellingPrice: initialData.sellingPrice || "",
        stockQuantity: initialData.stockQuantity || "",
        reorderLevel: initialData.reorderLevel || "",
      });
    } else {
      setForm({
        name: "",
        code: "",
        categoryId: "",
        supplierId: "",
        costPrice: "",
        sellingPrice: "",
        stockQuantity: "",
        reorderLevel: "",
      });
      setImageFile(null);
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };



  const submit = async () => {
    // basic validation
    if (!form.name.trim()) return;

    try {
      // If image present, prefer multipart for create/update
      if (imageFile) {
        const formData = new FormData();
        // append JSON payload
        formData.append("name", form.name);
        formData.append("code", form.code);
        formData.append("categoryId", form.categoryId);
        formData.append("supplierId", form.supplierId);
        formData.append("costPrice", form.costPrice);
        formData.append("sellingPrice", form.sellingPrice);
        formData.append("stockQuantity", form.stockQuantity);
        formData.append("reorderLevel", form.reorderLevel);

        if (mode === "add") {
          const resp = await apiClient.post("/products/product", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          onSubmit(resp.data);
        } else {
          // update
          const resp = await apiClient.put(`/products/product/${initialData.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          onSubmit(resp.data);
        }
      } else {
        // JSON path
        const payload = {
          name: form.name,
          code: form.code,
          categoryId: form.categoryId,
          supplierId: form.supplierId,
          costPrice: parseFloat(form.costPrice || 0),
          sellingPrice: parseFloat(form.sellingPrice || 0),
          stockQuantity: parseInt(form.stockQuantity || 0),
          reorderLevel: parseInt(form.reorderLevel || 0)
        };
        if (mode === "add") {
          const resp = await apiClient.post("/products/product", payload);
          onSubmit(resp.data);
        } else {
          const resp = await apiClient.put(`/products/product/${initialData.id}`, payload);
          onSubmit(resp.data);
        }
      }
    } catch (err) {
      // bubble error to parent through onSubmit as error object or throw
      onSubmit({ error: err.response?.data?.message || err.message });
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 520, p: 3 }}>
        <Typography variant="h6" fontWeight="700">
          {mode === "add" ? "Add Product" : "Edit Product"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Product details and stock information
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
          <TextField label="Code / SKU" name="code" value={form.code} onChange={handleChange} fullWidth />

          <FormControl fullWidth>
            <InputLabel id="cat-label">Category</InputLabel>
            <Select
              labelId="cat-label"
              name="categoryId"
              value={form.categoryId}
              label="Category"
              onChange={handleChange}
            >
              <MenuItem value="">-- Select --</MenuItem>
              {categories.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.categoryName || c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
              
        <FormControl fullWidth>
            <InputLabel id="supp-label">Supplier</InputLabel>
            <Select
              labelId="supp-label"
              name="supplierId"
              value={form.supplierId}
              label="Supplier"
              onChange={handleChange}
            >
              <MenuItem value="">-- Select --</MenuItem>
              {suppliers.map(s => (
                <MenuItem key={s.id} value={s.id}>{s.supplierName || s.name}</MenuItem>
              ))}
            </Select>
          </FormControl>


          <TextField type="number" label="Stock Qty" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} fullWidth />
        </Box>

        <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField type="number" label="Cost Price" name="costPrice" value={form.costPrice} onChange={handleChange} fullWidth />
          <TextField type="number" label="Selling Price" name="sellingPrice" value={form.sellingPrice} onChange={handleChange} fullWidth />
        </Box>

        <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
                type="number"
                label="Reorder Level"
                name="reorderLevel"
                value={form.reorderLevel}
                onChange={handleChange}
                fullWidth
            />
        </Box>

        <Box sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          p: 2,
          display: "flex",
          gap: 2,
          bgcolor: "white",
          borderTop: "1px solid #ddd"
        }}>
          <Button variant="outlined" fullWidth onClick={onClose}>Cancel</Button>
          <Button variant="contained" fullWidth onClick={submit}>
            {mode === "add" ? "Create Product" : "Save Product"}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ProductDrawer;
