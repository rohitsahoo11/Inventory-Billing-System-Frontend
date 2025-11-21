import React, { useState, useEffect } from "react";
import { Grid, Paper } from "@mui/material";
import ProductGrid from "../../components/sales/ProductGrid";
import BillingArea from "../../components/sales/BillingArea";
import { jwtDecode } from "jwt-decode";

 
const SalesPOS = () => {
  const [billItems, setBillItems] = useState([]);


    const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (typeof token === "string" && token.trim() !== "") {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        setUserId(decoded?.userId || null); // or decoded.userId if available
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);



  const handleAddProduct = (product) => {
    setBillItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.sellingPrice,
              }
            : item
        );
      }
      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          sellingPrice: product.sellingPrice,
          quantity: 1,
          total: product.sellingPrice,
        },
      ];
    });
  };

  return (
    <Grid container spacing={3}>
      {/* Left: Product Grid */}
      <Grid item xs={12} md={5}>
        <Paper elevation={3} sx={{ p: 2, height: "100%", overflowY: "auto" }}>
          <ProductGrid onSelectProduct={handleAddProduct} />
        </Paper>
      </Grid>

      {/* Right: Billing Area */}
      <Grid item xs={12} md={7}>
        <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
          <BillingArea billItems={billItems} setBillItems={setBillItems} userId={userId} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SalesPOS;