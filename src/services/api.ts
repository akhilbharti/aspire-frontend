
// Mock API service to simulate backend interactions
import { Card } from "@/context/CardContext";
import { Transaction } from "@/components/TransactionsList";
import { mockTransactions } from "@/data/mockData";

// Local storage keys
const CARDS_STORAGE_KEY = "aspire_cards";

// Default cards if none exist in storage
const defaultCards: Card[] = [
  {
    id: "card-1",
    name: "Mark Henry",
    lastFourDigits: "4567",
    expiry: "12/24",
    cvv: "123",
    frozen: false
  },
  {
    id: "card-2",
    name: "Mark Henry",
    lastFourDigits: "7890",
    expiry: "06/25",
    cvv: "456",
    frozen: true
  }
];

// Simulate network delay for realistic API behavior
const simulateNetworkDelay = (ms: number = 300) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Helper function to get cards from local storage
const getCardsFromStorage = (): Card[] => {
  try {
    const storedCards = localStorage.getItem(CARDS_STORAGE_KEY);
    if (storedCards) {
      return JSON.parse(storedCards);
    }
    // Initialize with default cards if none exist
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(defaultCards));
    return defaultCards;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return defaultCards;
  }
};

// Helper function to save cards to local storage
const saveCardsToStorage = (cards: Card[]): void => {
  try {
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards));
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
};

// Get all cards for a user
export const fetchCards = async (): Promise<Card[]> => {
  await simulateNetworkDelay();
  return getCardsFromStorage();
};

// Update a card's status
export const updateCardStatus = async (cardId: string, frozen: boolean): Promise<Card> => {
  await simulateNetworkDelay(200);
  
  const cards = getCardsFromStorage();
  const updatedCards = cards.map(card => 
    card.id === cardId ? { ...card, frozen } : card
  );
  
  saveCardsToStorage(updatedCards);
  
  const updatedCard = updatedCards.find(card => card.id === cardId);
  if (!updatedCard) {
    throw new Error(`Card with ID ${cardId} not found`);
  }
  
  return updatedCard;
};

// Fetch transactions for a specific card
export const fetchTransactions = async (cardId: string): Promise<Transaction[]> => {
  await simulateNetworkDelay(400);
  
  // Return mock transactions
  return mockTransactions;
};

// Add a new card
export const createCard = async (name: string): Promise<Card> => {
  await simulateNetworkDelay(500);
  
  // Generate a random card
  const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
  const monthsToAdd = Math.floor(Math.random() * 36) + 12; // 1-3 years
  const today = new Date();
  const expiryDate = new Date(today.setMonth(today.getMonth() + monthsToAdd));
  const expiryMonth = String(expiryDate.getMonth() + 1).padStart(2, '0');
  const expiryYear = String(expiryDate.getFullYear()).slice(2);
  
  const newCard: Card = {
    id: `card-${Date.now()}`,
    name,
    lastFourDigits: randomDigits,
    expiry: `${expiryMonth}/${expiryYear}`,
    cvv: Math.floor(100 + Math.random() * 900).toString(),
    frozen: false
  };
  
  // Add the new card to storage
  const cards = getCardsFromStorage();
  const updatedCards = [...cards, newCard];
  saveCardsToStorage(updatedCards);
  
  return newCard;
};
