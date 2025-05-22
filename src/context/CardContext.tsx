
import React, { createContext, useContext, useState } from "react";
import { useCardsData } from "@/hooks/use-cards-data";

export interface Card {
  id: string;
  name: string;
  lastFourDigits: string;
  expiry: string;
  cvv: string;
  frozen: boolean;
}

// Interface for the addCard return value
interface AddCardResult {
  newCardId: string;
  newIndex: number;
}

interface CardContextType {
  cards: Card[];
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;
  addCard: (name: string) => Promise<void>;
  freezeCard: (cardId: string) => void;
  unfreezeCard: (cardId: string) => void;
  isLoading: boolean;
  isAddCardLoading: boolean;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const { 
    cards, 
    isLoading, 
    freezeCard: apiFreeze, 
    unfreezeCard: apiUnfreeze, 
    addCard: apiAddCard,
    isAddCardLoading 
  } = useCardsData();

  // Enhanced addCard function that also updates the active card index
  const addCard = async (name: string) => {
    try {
      // Updated to handle the proper return type
      const result = await apiAddCard(name);
      // Now we know result has the expected shape with newIndex
      if (result && typeof result.newIndex === 'number') {
        // Update the active card index to the newly added card
        setActiveCardIndex(result.newIndex);
      }
    } catch (error) {
      console.error("Failed to add card:", error);
    }
  };

  // Create memoized context value to prevent unnecessary re-renders
  const value = React.useMemo(() => ({
    cards,
    activeCardIndex,
    setActiveCardIndex,
    addCard,
    freezeCard: apiFreeze,
    unfreezeCard: apiUnfreeze,
    isLoading,
    isAddCardLoading
  }), [cards, activeCardIndex, apiFreeze, apiUnfreeze, isLoading, isAddCardLoading]);

  return (
    <CardContext.Provider value={value}>
      {children}
    </CardContext.Provider>
  );
};

export const useCards = (): CardContextType => {
  const context = useContext(CardContext);
  
  if (context === undefined) {
    throw new Error("useCards must be used within a CardProvider");
  }
  
  return context;
};
