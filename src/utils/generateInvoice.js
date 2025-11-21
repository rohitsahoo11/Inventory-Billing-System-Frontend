import jsPDF from "jspdf";
import "jspdf-autotable"; // ✅ plugin auto-registers

export const generateInvoice = (saleData) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.text("INVOICE", 14, 20);

  doc.setFontSize(12);
  doc.text(`Sale ID: ${saleData.id || saleData.saleId}`, 14, 30);
  doc.text(`Date: ${new Date().toLocaleString()}`, 14, 37);
  doc.text("Shop Name: Smart Inventory Billing", 14, 47);
  doc.text("Address: Bhubaneswar, Odisha", 14, 54);

  // Table
  const tableRows = saleData.items.map((item) => [
    item.productName,
    item.quantity,
    item.unitPrice,
    item.totalPrice,
  ]);

  doc.autoTable({
    head: [["Product", "Qty", "Price", "Total"]],
    body: tableRows,
    startY: 65,
  });

  // Totals
  const totalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text(`Grand Total: ₹${saleData.totalAmount}`, 14, totalY);

  // Footer
  doc.setFontSize(10);
  doc.text("Thank you for your purchase!", 14, totalY + 15);

  // Save
  doc.save(`invoice_${saleData.saleId || saleData.id}.pdf`);
};