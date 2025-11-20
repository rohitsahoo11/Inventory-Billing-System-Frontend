import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import apiClient from "../../api/axiosClient";

const PurchaseDrawer = ({ open, setOpen, onSuccess }) => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    productId: "",
    supplierId: "",
    quantity: "",
    unitPrice: "",
  });
  const [loading, setLoading] = useState(false);
  

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
        // load categories for dropdown
        const loadProd = async () => {
          try {
            const res = await apiClient.get("/products");
            setProducts(res.data.data);
          } catch (e) { console.error(e); }
        };
        loadProd();
      }, []);
  

  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/purchases/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      await response.json();

      setOpen(false);
      if(onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to create purchase", error);
    }
    setLoading(false);
  };

  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <Box width={350} p={3}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Add Purchase
        </Typography>

        {/* Product */}
        <TextField
          select
          fullWidth
          label="Product"
          name="productId"
          value={form.productId}
          onChange={handleChange}
          margin="normal"
        >
          {products.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Supplier */}
        <TextField
          select
          fullWidth
          label="Supplier"
          name="supplierId"
          value={form.supplierId}
          onChange={handleChange}
          margin="normal"
        >
          {suppliers.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Quantity */}
        <TextField
          fullWidth
          label="Quantity"
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          margin="normal"
        />

        {/* Unit Price */}
        <TextField
          fullWidth
          label="Unit Price"
          type="number"
          name="unitPrice"
          value={form.unitPrice}
          onChange={handleChange}
          margin="normal"
        />

        {/* Total Price */}
        <TextField
          fullWidth
          label="Total Price"
          value={
            form.quantity && form.unitPrice
              ? form.quantity * form.unitPrice
              : ""
          }
          margin="normal"
          disabled
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Add Purchase"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default PurchaseDrawer;
