import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Data");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (data, fileName) => {
  const doc = new jsPDF();
  
  // Extract headers and rows from the JSON data
  const headers = Object.keys(data[0]);
  const rows = data.map(item => headers.map(header => item[header]));
  
  // Use jsPDF's autotable to add the table
  doc.autoTable({
    head: [headers],
    body: rows,
    theme: "striped",
    startY: 10,
  });

  // Save the file
  doc.save(`${fileName}.pdf`);
};
