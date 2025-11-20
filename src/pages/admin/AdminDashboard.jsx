import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  

} from "@mui/material";
import {
  Package,
  Layers,
  ClipboardList,
  ShoppingCart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  Cell
} from "recharts";
import apiClient from "../../api/axiosClient";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalPurchases: 0,
    totalSales: 0,
  });

  const [dailySales, setDailySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    loadDashboardStats();
    loadDailySales();
    loadMonthlySales();
    loadLowStock();
    loadTodaySummary();
    loadTopProducts();
    loadCategorySales();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await apiClient.get("/reports/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const loadDailySales = async () => {
    try {
      const res = await apiClient.get("/reports/sales/daily");
      setDailySales(res.data);
    } catch (error) {
      console.error("Error fetching daily sales:", error);
    }
  };

  const loadMonthlySales = async () => {
    try {
      const res = await apiClient.get("/reports/sales/monthly");
      setMonthlySales(res.data);
    } catch (error) {
      console.error("Error fetching monthly sales:", error);
    }
  };

  const loadLowStock = async () => {
    try {
      const res = await apiClient.get("/reports/stock/low");
      setLowStock(res.data);
    } catch (error) {
      console.error("Error fetching low stock data:", error);
    }
  };

  const cards = [
    {
      title: "Products",
      value: stats.totalProducts,
      color: "#3b82f6",
      icon: <Package size={28} />,
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      color: "#10b981",
      icon: <Layers size={28} />,
    },
    {
      title: "Purchases",
      value: stats.totalPurshace,
      color: "#8b5cf6",
      icon: <ClipboardList size={28} />,
    },
    {
      title: "Sales",
      value: stats.totalSales,
      color: "#f59e0b",
      icon: <ShoppingCart size={28} />,
    },
  ];

  const [todaySummary, setTodaySummary] = useState(null);
  const loadTodaySummary = async () => {
    const res = await apiClient.get("/reports/today-summary");
    setTodaySummary(res.data);
};

  const [topProducts, setTopProducts] = useState([]);
  const loadTopProducts = async () => {
  const res = await apiClient.get("/reports/sales/top-products");
  setTopProducts(res.data);
};

const [categorySales, setCategorySales] = useState([]);
const loadCategorySales = async () => {
  const res = await apiClient.get("/reports/sales/category-wise");
  setCategorySales(res.data);
};

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#6366F1"];

  return (
    <Box sx={{ px: 3, py: 4 }}>
      {/* Stats Cards */}
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {card.title}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: card.color, mt: 1 }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: "#f3f4f6", p: 1.5, borderRadius: 2 }}>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

        {/* Today Summary */}

  {todaySummary && (
  <Grid container spacing={3} sx={{ mt: 4 }}>
    {/* Sales Card */}
    <Grid item xs={12} sm={4}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, borderLeft: '6px solid #10b981' }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Today's Sales
          </Typography>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#10b981', mt: 1 }}>
            ₹{todaySummary.totalSales}
          </Typography>
        </Box>
      </Paper>
    </Grid>

    {/* Purchases Card */}
    <Grid item xs={12} sm={4}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, borderLeft: '6px solid #3b82f6' }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Today's Purchases
          </Typography>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#3b82f6', mt: 1 }}>
            ₹{todaySummary.totalPurchase}
          </Typography>
        </Box>
      </Paper>
    </Grid>
    {/* Transactions Card */}
    <Grid item xs={12} sm={4}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, borderLeft: '6px solid #8b5cf6' }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Total Transactions
          </Typography>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#8b5cf6', mt: 1 }}>
            {todaySummary.totalTransactions}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  </Grid>
)}

  {/* Top Selling Products */}
  <Box sx={{ mt: 5 }}>
  <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
    <Typography variant="h6" fontWeight={600} mb={2}>
      Top Selling Products
    </Typography>

    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Quantity Sold</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Revenue</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {topProducts.map((item, index) => (
            <TableRow key={index} hover>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.totalQuantitySold}</TableCell>
              <TableCell>₹{item.revenue.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
</Box>
      
      {/* Top selling bar-chart */}
      <Box sx={{ mt: 5 }}>
  <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
    <Typography variant="h6" fontWeight={600} mb={2}>
      Top Selling Products Chart
    </Typography>

    <Box sx={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={topProducts}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#f9fafb", borderRadius: 8 }}
            labelStyle={{ fontWeight: 600 }}
          />
          <Legend />
          <Bar dataKey="totalQuantitySold" fill="#3B82F6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  </Paper>
</Box>

    
    {/* Category wise table */}
    <Box sx={{ mt: 5 }}>
  <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
    <Typography variant="h6" fontWeight={600} mb={2}>
      Category-wise Sales
    </Typography>

    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Total Revenue (₹)</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {categorySales.map((item, index) => (
            <TableRow key={index} hover>
              <TableCell>{item.categoryName}</TableCell>
              <TableCell>₹{item.totalRevenue.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
</Box>

      {/* Category wise pie-chart */}
      <Box sx={{ mt: 5 }}>
  <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
    <Typography variant="h6" fontWeight={600} mb={2}>
      Category-wise Sales Chart
    </Typography>

    <Box sx={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categorySales}
            dataKey="totalRevenue"
            nameKey="categoryName"
            outerRadius={110}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {categorySales.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `₹${value.toFixed(2)}`}
            contentStyle={{ backgroundColor: "#f9fafb", borderRadius: 8 }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  </Paper>
</Box>



      {/* Charts Section */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
  {/* Full-width Daily Sales Chart */}
  <Grid item xs={12}>
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>Daily Sales (Last 7 Days)</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dailySales} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={{ backgroundColor: "#f9fafb", borderRadius: 8 }} />
          <Bar dataKey="totalSale" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  </Grid>


        {/* Monthly Sales Chart */}
  <Grid item xs={12}>
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>Monthly Sales Summary</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlySales} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={{ backgroundColor: "#f9fafb", borderRadius: 8 }} />
          <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  </Grid>


       {/* Low Stock Products Chart */}
  <Grid item xs={12}>
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>Low Stock Products</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={lowStock} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="productName" tick={{ fontSize: 12 }} interval={0} angle={-30} textAnchor="end" />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={{ backgroundColor: "#fef2f2", borderRadius: 8 }} />
          <Bar dataKey="quantity" fill="#ef4444" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  </Grid>
</Grid>

    </Box>
  );
};

export default AdminDashboard;