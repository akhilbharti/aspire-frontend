
import React from 'react';
import TransactionItem from './TransactionItem';
import { useMediaQuery } from "@/hooks/use-media-query";
import { businessFinanceIcon, downArrowIcon, downArrowIcon1, groupIcon } from '@/assets';

export interface Transaction {
  merchant: string;
  date: string;
  amount: string;
  isCredit: boolean;
  type: "refund" | "purchase" | "travel" | "announcement";
}

interface TransactionsListProps {
  transactions: Transaction[];
  isOpen: boolean;
  onToggle: () => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ 
  transactions,
  isOpen,
  onToggle
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  return (
    <div className="bg-white rounded-xl p-4 md:p-6 animate-fade-in w-full min-h-[120px]">
      <div 
        className="flex justify-between items-center cursor-pointer bg-[#F5F9FF] border-[#F5F5F5] border-[1px] p-3 pt-0 md:p-4 rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:bg-[#EDF3FF] transition-colors duration-200"
        onClick={onToggle}
        role="button"
        aria-expanded={isOpen}
        aria-controls="transactions-content"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="flex items-center">
          <img src={groupIcon} className="w-5 h-5 mr-2" alt="Transactions icon" />
          <h2 className="text-sm font-medium text-aspire-tabsActiveColor">Recent transactions</h2>
        </div>
        <img 
          src={isOpen ? downArrowIcon1 : downArrowIcon} 
          className="w-5 h-5 transition-transform" 
          alt={isOpen ? "Collapse transactions" : "Expand transactions"}
        />
      </div>
      
      <div 
        id="transactions-content" 
        className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {isOpen && (
          <div className="space-y-0 animate-slide-in border-[#FCFCFC] border-[1px] rounded-lg rounded-tr-none rounded-tl-none p-4 shadow-[0_2px_12px_rgba(0,0,0,0.08)] data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            {transactions.map((transaction, index) => (
              <TransactionItem 
                key={index} 
                merchant={transaction.merchant} 
                date={transaction.date} 
                amount={transaction.amount} 
                isCredit={transaction.isCredit} 
                type={transaction.type}
              />
            ))}
          </div>
        )}
      </div>
      <button 
        className="w-full flex justify-between align-middle flex-col items-center p-4 rounded-lg rounded-tr-none rounded-tl-none border-[#DDFFEC] border-[1px] bg-[#EDFFF5] text-aspire-green font-medium mt-1 hover:bg-[#E0FFF0] transition-colors duration-200"
        aria-label="View all card transactions"
      >
        <span>View all card transactions</span>
      </button>
    </div>
  );
};

export default React.memo(TransactionsList);
