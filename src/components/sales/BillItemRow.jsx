import React from "react";
import { IconButton, TextField, TableRow, TableCell } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const BillItemRow = ({ item, billItems, setBillItems }) => {
  const handleQtyChange = (qty) => {
    if (qty < 1) return;
    setBillItems(
      billItems.map((p) =>
        p.id === item.id
          ? { ...p, quantity: qty, total: qty * p.sellingPrice }
          : p
      )
    );
  };

  const handleRemove = () => {
    setBillItems(billItems.filter((p) => p.id !== item.id));
  };

  return (
    <TableRow hover>
      <TableCell>{item.name}</TableCell>
      <TableCell>₹{item.sellingPrice}</TableCell>
      <TableCell>
        <TextField
          type="number"
          value={item.quantity}
          onChange={(e) => handleQtyChange(parseInt(e.target.value))}
          inputProps={{ min: 1 }}
          size="small"
          sx={{ width: 80 }}
        />
      </TableCell>
      <TableCell>₹{item.total}</TableCell>
      <TableCell>
        <IconButton color="error" onClick={handleRemove}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default BillItemRow;