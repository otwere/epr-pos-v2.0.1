export const generateNextJournalEntryNumber = (items) => {
  const lastJE = items[items.length - 1]?.journalEntryNumber || "JE000";
  const lastNumber = parseInt(lastJE.replace("JE", ""), 10);
  return `JE${String(lastNumber + 1).padStart(3, "0")}`;
};

export const validateJournalEntry = (values) => {
  const { creditAccount, debitAccount, amount } = values;
  
  if (creditAccount === debitAccount) {
    throw new Error("Credit and Debit accounts must be different");
  }

  if (amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  return true;
};

