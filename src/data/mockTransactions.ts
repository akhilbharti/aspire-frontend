
import { Transaction } from "@/components/TransactionsList";

export const mockTransactions: Transaction[] = [
  {
    merchant: "Hamleys",
    date: "20 May 2020",
    amount: "150",
    isCredit: true,
    type: "refund"
  },
  {
    merchant: "Hamleys",
    date: "20 May 2020", 
    amount: "150",
    isCredit: false,
    type: "travel"
  },
  {
    merchant: "Hamleys",
    date: "20 May 2020",
    amount: "150",
    isCredit: false,
    type: "announcement"
  },
  {
    merchant: "Hamleys",
    date: "20 May 2020",
    amount: "150",
    isCredit: false,
    type: "purchase"
  }
];
