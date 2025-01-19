import jsPDF from "jspdf";
import "jspdf-autotable";

export const handleExport = (items) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Journal Entries", 14, 22);

  const tableData = items.map((item) => [
    item.journalEntryNumber,
    item.accountName,
    item.transactionDate,
    item.credit.toLocaleString(),
    item.debit.toLocaleString(),
    item.amount.toLocaleString(),
    item.narration,
  ]);

  doc.autoTable({
    head: [["Journal Entry Number", "Account Name", "Transaction Date", "Credit", "Debit", "Amount", "Narration"]],
    body: tableData,
    startY: 30,
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 
      0: { cellWidth: 30 },
      1: { cellWidth: 30 },
      2: { cellWidth: 25 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
      6: { cellWidth: 'auto' }
    }
  });

  doc.save("journal_entries.pdf");
};

