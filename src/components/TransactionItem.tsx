
import React from 'react';
import { flightsIcon, businessFinanceIcon, nextArrow, fileStorageIcon, megaphoneIcon } from '../assets';

interface TransactionItemProps {
  merchant: string;
  date: string;
  amount: string;
  isCredit: boolean;
  type: "refund" | "purchase" | "travel" | "announcement";
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  merchant,
  date,
  amount,
  isCredit,
  type
}) => {
  // Function to determine icon background color
  const getIconBackground = () => {
    if (type === "refund") return "bg-[#00D6B51A]";
    if (type === "travel") return "bg-[#009DFF1A]";
    if (type === "announcement") return "bg-[#F251951A]";
    return "bg-[#F5F9FF]"; // Default background
  };

  // Function to determine transaction icon
  const getTransactionIcon = () => {
    if (type === "travel") {
      return <img src={flightsIcon} alt="Travel transaction" className="w-5 h-5" />;
    } else if (type === "announcement") {
      return <img src={megaphoneIcon} alt="Announcement notification" className="w-5 h-5" />;
    }
    return <img src={fileStorageIcon} alt={isCredit ? "Refund transaction" : "Purchase transaction"} className="w-5 h-5" />;
  };

  // Function to get transaction description text
  const getTransactionDescription = () => {
    if (isCredit) {
      return "Refund to debit card";
    } else {
      return "Charged to debit card";
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-[#F5F5F5] last:border-0">
      <div className="flex items-center">
        <div className={`${getIconBackground()} rounded-full mr-3 flex items-center justify-center w-12 h-12`}>
          {getTransactionIcon()}
        </div>
        <div>
          <h3 className="text-[14px] font-medium text-aspire-tabsActiveColor">{merchant}</h3>
          <p className="text-[12px] text-[#AAAAAA] mt-0.5">{date}</p>
          <div className="flex items-center justify-end mt-3">
            <span
              className="flex items-center justify-center rounded-full mr-1 bg-[#325BAF] w-[24px] h-[20px]"          >
              <img src={businessFinanceIcon} className="w-3.5 h-3.5" alt="Card payment method" />
            </span>
            <p className="text-[12px] font-medium text-[#325BAF]">{getTransactionDescription()}</p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-[14px] font-bold ${isCredit ? 'text-aspire-green' : 'text-aspire-tabsActiveColor'} flex items-center`}>
          {isCredit ? '+' : '-'} S$ {amount}
          <img src={nextArrow} className="w-3 h-3 ml-1" alt="View details" />
        </p>
      </div>
    </div>
  );
};

export default TransactionItem;
