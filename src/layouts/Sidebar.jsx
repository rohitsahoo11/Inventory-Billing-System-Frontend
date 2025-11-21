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

  // Choose dashboard path based on role
  const dashboardPath =
    role === "INVENTORY_MANAGER" ? "/inventory/dashboard" : "/admin/dashboard";

  const menuItems = [
    {
      section: "General",
      items: [{ label: "Dashboard", path: dashboardPath, icon: LayoutDashboard }],
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
          backgroundColor: "#0f172a",
          color: "#e2e8f0",
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
                color: "#94a3b8",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              {section.section}
            </Typography>

            {section.items.map((item, i) => (
              <ListItem
                // Use NavLink as the underlying component so MUI receives the active class
                component={NavLink}
                to={item.path}
                key={i}
                // NavLink will call this to set the class on the ListItem
                className={({ isActive }) => (isActive ? "active-link" : "inactive-link")}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  color: "#e2e8f0",
                  "&.active-link": {
                    backgroundColor: "#1e293b",
                    color: "#3b82f6",
                    fontWeight: 600,
                  },
                  "&:hover": {
                    backgroundColor: "#1e293b",
                    color: "#60a5fa",
                  },
                  textDecoration: "none",
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                  <item.icon size={20} />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </Box>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;