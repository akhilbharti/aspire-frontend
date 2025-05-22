
import React from "react";
import CardsDashboard from "@/components/CardsDashboard";
import { Card } from "@/context/CardContext";
import { Transaction } from "@/components/TransactionsList";
import { useMediaQuery } from "@/hooks/use-media-query";

interface CardTabContentProps {
  activeTab: string;
  cards: Card[];
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;
  activeAccordion: string | null;
  showTransactions: boolean;
  handleAccordionChange: (value: string | null) => void;
  handleTransactionsToggle: () => void;
  mockTransactions: Transaction[];
}

const CardTabContent: React.FC<CardTabContentProps> = ({
  activeTab,
  cards,
  activeCardIndex,
  setActiveCardIndex,
  activeAccordion,
  showTransactions,
  handleAccordionChange,
  handleTransactionsToggle,
  mockTransactions
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  return (
    <div className={`${isMobile ? 'mt-4' : 'mt-5'} min-h-[800px]`}>
      {activeTab === "debit" ? (
        <CardsDashboard 
          cards={cards}
          activeCardIndex={activeCardIndex}
          setActiveCardIndex={setActiveCardIndex}
          activeAccordion={activeAccordion}
          showTransactions={showTransactions}
          handleAccordionChange={handleAccordionChange}
          handleTransactionsToggle={handleTransactionsToggle}
          mockTransactions={mockTransactions}
        />
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">All company cards will be displayed here</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(CardTabContent);
