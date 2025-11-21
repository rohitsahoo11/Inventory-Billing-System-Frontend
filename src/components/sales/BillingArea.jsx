import React, { useState } from "react";
import { generateInvoice } from "../../utils/generateInvoice";

import {
  Typography,
  TextField,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Divider,
  Grid,
} from "@mui/material";
import BillItemRow from "./BillItemRow";

const BillingArea = ({ billItems, setBillItems, userId }) => {
  const [customerName, setCustomerName] = useState("");
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);

  const calculateSubtotal = () =>
    billItems.reduce((sum, item) => sum + item.total, 0);

  const calculateTax = (subtotal) => (subtotal * taxRate) / 100;
  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal - discount + tax;
  };

  const handleSaveSale = async () => {
    const productIds = billItems.map((item) => item.id);
    const quantities = billItems.map((item) => item.quantity);

    const payload = {
      customerName,
      productIds,
      quantities,
      userId,
      totalAmount: calculateGrandTotal(),
    };

    try {
      const res = await fetch("http://localhost:8080/api/sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      // Generate invoice PDF
        generateInvoice({
        saleId: data.id,
        date: new Date(),
        items: billItems.map(item => ({
            productName: item.name,
            quantity: item.quantity,
            unitPrice: item.sellingPrice,
            totalPrice: item.total,
        })),
        totalAmount: calculateGrandTotal(),
        });

        // Clear form
        setBillItems([]);
        setCustomerName("");
        setDiscount(0);
        setTaxRate(0);
      // Optionally reset form or show success
    } catch (err) {
      console.error("Failed to save sale", err);
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Billing
      </Typography>

      <TextField
        label="Customer Name"
        fullWidth
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Qty</TableCell>
            <TableCell>Total</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {billItems.map((item) => (
            <BillItemRow
              key={item.id}
              item={item}
              billItems={billItems}
              setBillItems={setBillItems}
            />
          ))}
        </TableBody>
      </Table>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Discount (₹)"
            type="number"
            fullWidth
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value || 0))}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Tax Rate (%)"
            type="number"
            fullWidth
            value={taxRate}
            onChange={(e) => setTaxRate(parseFloat(e.target.value || 0))}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Typography>Subtotal: ₹{calculateSubtotal().toFixed(2)}</Typography>
        <Typography>Tax: ₹{calculateTax(calculateSubtotal()).toFixed(2)}</Typography>
        <Typography>Discount: ₹{discount.toFixed(2)}</Typography>
        <Typography variant="h6" fontWeight="bold" mt={1}>
          Grand Total: ₹{calculateGrandTotal().toFixed(2)}
        </Typography>
      </Box>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        onClick={handleSaveSale}
      >
        Save Sale
      </Button>
    </Box>
  );
};

export default BillingArea;