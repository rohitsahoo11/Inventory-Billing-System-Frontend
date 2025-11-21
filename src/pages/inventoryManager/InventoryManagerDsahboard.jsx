import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const InventoryManagerDashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [recentPurchases, setRecentPurchases] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const safeList = (payload) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.data)) return payload.data;
    return [];
  };

  const loadDashboardData = async () => {
    try {
      // Products
      const productsRes = await fetch("http://localhost:8080/api/products");
      const productsJson = await productsRes.json();
      const productsList = safeList(productsJson);
      setProductCount(productsList.length);

      // Low stock (endpoint may return array or count)
      const lowStockRes = await fetch("http://localhost:8080/api/reports/low-stock");
      const lowStockJson = await lowStockRes.json();
      const lowStockList = safeList(lowStockJson);
      // If endpoint returns a number in data, handle that too
      const lowCount =
        typeof lowStockJson?.data === "number"
          ? Number(lowStockJson.data)
          : lowStockList.length;
      setLowStockCount(lowCount);

      // Categories
      const catRes = await fetch("http://localhost:8080/api/category");
      const catJson = await catRes.json();
      const catList = safeList(catJson);
      setCategoryCount(catList.length);

      // Recent Purchases
      const purchaseRes = await fetch("http://localhost:8080/api/purchases");
      const purchaseJson = await purchaseRes.json();
      const purchases = safeList(purchaseJson)
        // sort by createdAt or id descending if available
        .sort((a, b) => {
          const da = new Date(a.createdAt || a.date || 0).getTime();
          const db = new Date(b.createdAt || b.date || 0).getTime();
          return db - da || (b.id || 0) - (a.id || 0);
        })
        .slice(0, 8); // show latest 8
      setRecentPurchases(purchases);
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Inventory Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card elevation={1}>
            <CardContent>
              <Typography color="textSecondary">Total Products</Typography>
              <Typography variant="h4">{productCount}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card elevation={1}>
            <CardContent>
              <Typography color="textSecondary">Low Stock Items</Typography>
              <Typography variant="h4" color="error">
                {lowStockCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card elevation={1}>
            <CardContent>
              <Typography color="textSecondary">Total Categories</Typography>
              <Typography variant="h4">{categoryCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Purchases */}
      <Card elevation={1} sx={{ mt: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography variant="h6" fontWeight="bold">
              Recent Purchases
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip icon={<LocalShippingIcon />} label={`${recentPurchases.length} recent`} size="small" />
              <IconButton size="small" onClick={loadDashboardData} aria-label="refresh">
                <ReceiptLongIcon />
              </IconButton>
            </Stack>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {recentPurchases.length === 0 ? (
            <Typography mt={2} color="textSecondary">
              No recent purchases found.
            </Typography>
          ) : (
            <List disablePadding>
              {recentPurchases.map((p) => {
                const productName = p.product?.name || p.productName || "Unknown product";
                const supplier = p.supplier?.name || p.supplierName || "Unknown supplier";
                const qty = p.quantity ?? p.qty ?? p.items?.length ?? 0;
                const total = p.totalPrice ?? p.total ?? p.amount ?? "—";
                const date = p.createdAt || p.date || p.purchaseDate || null;

                return (
                  <ListItem
                    key={p.id || `${productName}-${Math.random()}`}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: "background.paper",
                      boxShadow: 0,
                    }}
                    secondaryAction={
                      <Stack alignItems="flex-end" spacing={0.5}>
                        <Typography variant="subtitle2">₹{total}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(date)}
                        </Typography>
                      </Stack>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.light", color: "primary.contrastText" }}>
                        {productName.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="subtitle1" noWrap>
                            {productName}
                          </Typography>
                          <Chip label={`Qty: ${qty}`} size="small" color="info" />
                        </Stack>
                      }
                      secondary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {supplier}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            • Purchase ID: {p.id ?? "—"}
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default InventoryManagerDashboard;