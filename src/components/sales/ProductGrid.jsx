import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  CardActionArea,
} from "@mui/material";
import { getAllProducts } from "../../api/productApi";

const ProductGrid = ({ onSelectProduct }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Products
      </Typography>

      <TextField
        fullWidth
        label="Search product"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        variant="outlined"
        size="small"
        sx={{ mb: 3 }}
      />

      <Grid container spacing={2}>
        {filtered.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card variant="outlined">
              <CardActionArea onClick={() => onSelectProduct(product)}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="600">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{product.sellingPrice}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    In Stock: {product.stockQuantity}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductGrid;