import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  ClipboardList,
  Users,
} from "lucide-react";

const Sidebar = () => {
  const { role } = useSelector((state) => state.auth);

  const menuItems = [
    {
      section: "General",
      items: [{ label: "Dashboard", path: "/dashboard", icon: LayoutDashboard }],
    },
    ...(role === "INVENTORY_MANAGER" || role === "ADMIN"
      ? [
          {
            section: "Inventory",
            items: [
              { label: "Products", path: "/inventory/products", icon: Package },
              { label: "Categories", path: "/inventory/categories", icon: Layers },
              { label: "Purchases", path: "/inventory/purchase", icon: ClipboardList },
            ],
          },
        ]
      : []),
    ...(role === "SALES_EXECUTIVE" || role === "ADMIN"
      ? [
          {
            section: "Sales",
            items: [{ label: "Sales", path: "/sales", icon: ShoppingCart }],
          },
        ]
      : []),
    ...(role === "ADMIN"
      ? [
          {
            section: "Admin",
            items: [{ label: "Users", path: "/users", icon: Users }],
          },
        ]
      : []),
  ];

  return (
    <Drawer
  variant="permanent"
  anchor="left"
  sx={{
    width: 240,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: 240,
      boxSizing: "border-box",
      backgroundColor: "#0f172a", // slate-900
      color: "#e2e8f0", // soft white
    },
  }}
>
  <Box sx={{ px: 2, py: 3 }}>
    <Typography variant="h6" fontWeight={700} sx={{ color: "#3b82f6" }}>
      Inventory System
    </Typography>
  </Box>

  <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

  <List>
    {menuItems.map((section, idx) => (
      <Box key={idx} sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            color: "#94a3b8", // slate-400
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          {section.section}
        </Typography>

        {section.items.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            style={{ textDecoration: "none" }}
            className={({ isActive }) => (isActive ? "active-link" : "inactive-link")}
          >
            <ListItem
              button
              sx={{
                px: 2,
                py: 1,
                borderRadius: 1,
                color: "#e2e8f0",
                "&.active-link": {
                  backgroundColor: "#1e293b", // slate-800
                  color: "#3b82f6", // blue-500
                  fontWeight: 600,
                },
                "&:hover": {
                  backgroundColor: "#1e293b",
                  color: "#60a5fa", // blue-400
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                <item.icon size={20} />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          </NavLink>
        ))}
      </Box>
    ))}
  </List>
</Drawer>
  );
};

export default Sidebar;