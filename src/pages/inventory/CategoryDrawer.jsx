import React from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Divider,
  Button,
} from "@mui/material";

const CategoryDrawer = ({
  open,
  onClose,
  mode,
  initialData,
  onSubmit,
}) => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  // Fill data when editing
  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    onSubmit({ name, description });
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 380, padding: 3 }}>
        {/* Drawer Header */}
        <Typography variant="h6" fontWeight="bold">
          {mode === "add" ? "Add New Category" : "Edit Category"}
        </Typography>

        <Typography variant="body2" color="gray" sx={{ mt: 0.5 }}>
          Manage product categories
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Form Fields */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>

        {/* Bottom Fixed Buttons */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            p: 2,
            display: "flex",
            gap: 2,
            bgcolor: "white",
            borderTop: "1px solid #ddd",
          }}
        >
          <Button variant="outlined" fullWidth onClick={onClose}>
            Cancel
          </Button>

          <Button variant="contained" fullWidth onClick={handleSubmit}>
            {mode === "add" ? "Create" : "Save Changes"}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CategoryDrawer;