
import React, { useState, useMemo, useEffect } from "react";
import CardCarousel from "@/components/CardCarousel";
import CardControls from "@/components/CardControls";
import CardDetails from "@/components/CardDetails";
import TransactionsList from "@/components/TransactionsList";
import { Transaction } from "@/components/TransactionsList";
import { Card } from "@/context/CardContext";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface CardsDashboardProps {
  cards: Card[];
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;
  activeAccordion: string | null;
  showTransactions: boolean;
  handleAccordionChange: (value: string | null) => void;
  handleTransactionsToggle: () => void;
  mockTransactions: Transaction[];
}

const CardsDashboard: React.FC<CardsDashboardProps> = ({
  cards,
  activeCardIndex,
  setActiveCardIndex,
  activeAccordion,
  showTransactions,
  handleAccordionChange,
  handleTransactionsToggle,
  mockTransactions
}) => {
  const [showCardNumbers, setShowCardNumbers] = useState<{[cardId: string]: boolean}>({});
  
  const currentCard = useMemo(() => cards[activeCardIndex] || {
    id: "",
    name: "",
    lastFourDigits: "",
    expiry: "",
    cvv: "",
    frozen: false
  }, [cards, activeCardIndex]);
  
  // Get the showCardNumber state for the current card
  const showCardNumber = currentCard.id ? !!showCardNumbers[currentCard.id] : false;
  
  // Update activeCardIndex if we receive new cards and the current index is out of bounds
  useEffect(() => {
    if (cards.length > 0 && activeCardIndex >= cards.length) {
      setActiveCardIndex(cards.length - 1);
    }
  }, [cards, activeCardIndex, setActiveCardIndex]);
  
  // Reset showCardNumber when a card becomes frozen
  useEffect(() => {
    if (currentCard.id && currentCard.frozen && showCardNumbers[currentCard.id]) {
      setShowCardNumbers(prev => ({
        ...prev,
        [currentCard.id]: false
      }));
    }
  }, [currentCard.id, currentCard.frozen, showCardNumbers]);
  
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  const toggleCardNumber = () => {
    if (!currentCard.id || currentCard.frozen) return;
    
    setShowCardNumbers(prev => ({
      ...prev,
      [currentCard.id]: !prev[currentCard.id]
    }));
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 bg-white p-4 md:p-8 rounded border border-[#FCFCFC] shadow-[0_2px_12px_rgba(0,0,0,0.08)] min-h-[700px]">
      <div className="lg:col-span-3">
        {cards.length > 0 ? (
          <div className="space-y-6 w-full">
            {/* Show/Hide Card Number Button - Disabled for frozen cards */}
            <div className="relative top-[-14px] flex justify-end w-full">
              <Button 
                onClick={toggleCardNumber} 
                variant="ghost" 
                size="sm" 
                disabled={currentCard.frozen}
                className={`flex items-center gap-3 text-sm hover:bg-transparent py-[7px] mx-[10px]
                  ${currentCard.frozen 
                    ? 'cursor-not-allowed hover:no-underline' 
                    : 'hover:underline'}`}
                aria-pressed={showCardNumber}
                aria-label={showCardNumber ? "Hide card number" : "Show card number"}
              >
                {showCardNumber ? (
                  <>
                    <EyeOff size={16} className={currentCard.frozen ? "text-gray-400" : "text-[#01D167]"} aria-hidden="true" />
                    <span className={currentCard.frozen 
                      ? "text-gray-400 font-medium text-[14px]" 
                      : "text-[#01D167] font-medium text-[14px] hover:underline"}>Hide card number</span>
                  </>
                ) : (
                  <>
                    <Eye size={16} className={currentCard.frozen ? "text-gray-400" : "text-[#01D167]"} aria-hidden="true" /> 
                    <span className={currentCard.frozen 
                      ? "text-gray-400 font-medium text-[14px]" 
                      : "text-[#01D167] font-medium text-[14px] hover:underline"}>Show card number</span>
                  </>
                )}
              </Button>
            </div>
            
            <CardCarousel 
              cards={cards}
              activeCardIndex={activeCardIndex}
              setActiveCardIndex={setActiveCardIndex}
              showCardNumber={showCardNumber}
            />
            
            <CardControls 
              cardId={currentCard.id}
              isFrozen={currentCard.frozen}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl">
            <p className="text-gray-500 font-open-sans">No cards available. Add a card to get started.</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 lg:mt-0 lg:col-span-2 space-y-3">
        <CardDetails 
          cardNumber={`**** **** **** ${currentCard.lastFourDigits}`}
          cardType="Debit Card"
          cardStatus={currentCard.frozen ? "Frozen" : "Active"}
          activeAccordion={activeAccordion}
          onToggle={handleAccordionChange}
        />
        
        <TransactionsList 
          transactions={mockTransactions}
          isOpen={showTransactions}
          onToggle={handleTransactionsToggle}
        />
      </div>
    </div>
  );
};

export default React.memo(CardsDashboard);
