import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Typography,
} from "@mui/material";
import PurchaseDrawer from "./PurchaseDrawer";
import apiClient from "../../api/axiosClient";

const PurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);

  const fetchPurchases = async () => {
    try {
      const response = await apiClient.get("/purchases");
      setPurchases(response.data.data);
    } catch (error) {
      console.error("Failed to fetch purchases", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <Typography variant="h5" fontWeight="bold">
          Manage Purchases
        </Typography>

        <Button variant="contained" onClick={() => setOpenDrawer(true)} sx={{mb:3,mt:3}}>
          + Add Purchase
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper} className="shadow-md">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {purchases.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.product?.name}</TableCell>
                  <TableCell>{p.supplier?.name}</TableCell>
                  <TableCell>{p.quantity}</TableCell>
                  <TableCell>₹{p.unitPrice}</TableCell>
                  <TableCell>₹{p.totalPrice}</TableCell>
                  <TableCell>
                    {new Date(p.product?.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Drawer Component */}
      <PurchaseDrawer open={openDrawer} setOpen={setOpenDrawer} onSuccess={fetchPurchases} />
    </div>
  );
};

export default PurchaseList;
