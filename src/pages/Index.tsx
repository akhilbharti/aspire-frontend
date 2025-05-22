
import React, { useState, useCallback } from "react";
import { Tabs } from "@/components/ui/tabs";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useCards } from "@/context/CardContext";
import AddCardModal from "@/components/AddCardModal";
import BalanceHeader from "@/components/BalanceHeader";
import CardTabContent from "@/components/CardTabContent";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "@/services/api";

const CardDashboard = () => {
  const [activeTab, setActiveTab] = useState("debit");
  const [addCardModalOpen, setAddCardModalOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [showTransactions, setShowTransactions] = useState(true);
  const { cards, activeCardIndex, setActiveCardIndex } = useCards();
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  // Get current card ID for transactions
  const currentCardId = cards[activeCardIndex]?.id || '';
  
  // Fetch transactions using React Query
  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions", currentCardId],
    queryFn: () => fetchTransactions(currentCardId),
    enabled: !!currentCardId,
  });

  const handleAccordionChange = useCallback((value: string | null) => {
    // Close transactions if opening an accordion item
    if (value !== null) {
      setShowTransactions(false);
    }
    setActiveAccordion(value);
  }, []);

  const handleTransactionsToggle = useCallback(() => {
    // Close accordion if opening transactions
    if (!showTransactions) {
      setActiveAccordion(null);
    }
    setShowTransactions(!showTransactions);
  }, [showTransactions]);

  return (
    <div className="flex h-screen overflow-hidden bg-aspire-gray">
      {/* Only show sidebar on desktop */}
      {!isMobile && <Sidebar />}
      
      {/* Mobile bottom navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white h-16 border-t border-gray-100 flex items-center justify-around z-10">
          <button className="flex flex-col items-center justify-center w-1/5 hover:text-aspire-green transition-colors">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-400">
              <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
            <span className="text-xs mt-1 text-gray-400">Home</span>
          </button>
          <button className="flex flex-col items-center justify-center w-1/5 hover:text-aspire-green">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-aspire-green">
              <path fill="currentColor" d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
            </svg>
            <span className="text-xs mt-1 text-aspire-green font-medium">Cards</span>
          </button>
          <button className="flex flex-col items-center justify-center w-1/5 hover:text-aspire-green transition-colors">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-400">
              <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
            </svg>
            <span className="text-xs mt-1 text-gray-400">Payments</span>
          </button>
          <button className="flex flex-col items-center justify-center w-1/5 hover:text-aspire-green transition-colors">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-400">
              <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span className="text-xs mt-1 text-gray-400">Credit</span>
          </button>
          <button className="flex flex-col items-center justify-center w-1/5 hover:text-aspire-green transition-colors">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-400">
              <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
            <span className="text-xs mt-1 text-gray-400">Account</span>
          </button>
        </div>
      )}

      <div className={`flex-1 flex flex-col overflow-y-auto ${isMobile ? 'pb-20' : 'bg-white'}`}>
        <div className={`${isMobile ? 'w-full' : 'mx-auto w-full max-w-[1240px]'}`}>
          <div className={`${isMobile ? 'bg-transparent p-4' : ' p-8 md:p-12'}`}>
            <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value)}>
              {/* Header Section with Balance and New Card Button */}
              <BalanceHeader onAddCardClick={() => setAddCardModalOpen(true)} />
              <AddCardModal 
                open={addCardModalOpen} 
                onOpenChange={setAddCardModalOpen}
              />
              
              {/* Navigation Tabs */}
              <Navbar 
                defaultTab={activeTab}
                onTabChange={(value) => setActiveTab(value)}
              />
              
              {/* Content Section */}
              <CardTabContent 
                activeTab={activeTab}
                cards={cards}
                activeCardIndex={activeCardIndex}
                setActiveCardIndex={setActiveCardIndex}
                activeAccordion={activeAccordion}
                showTransactions={showTransactions}
                handleAccordionChange={handleAccordionChange}
                handleTransactionsToggle={handleTransactionsToggle}
                mockTransactions={transactions}
              />
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <CardDashboard />
  );
};

export default Index;
