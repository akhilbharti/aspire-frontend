
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCards, updateCardStatus, createCard } from "@/services/api";
import { Card } from "@/context/CardContext";

// Define the return type for addCard
interface AddCardResult {
  newCardId: string;
  newIndex: number;
}

export function useCardsData() {
  const queryClient = useQueryClient();
  
  // Fetch all cards
  const { data: cards = [], isLoading, error } = useQuery({
    queryKey: ["cards"],
    queryFn: fetchCards,
  });
  
  // Freeze/unfreeze card mutation
  const freezeCardMutation = useMutation({
    mutationFn: ({ cardId, frozen }: { cardId: string; frozen: boolean }) => 
      updateCardStatus(cardId, frozen),
    onSuccess: () => {
      // Invalidate and refetch cards query when status changes
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    }
  });
  
  // Add new card mutation
  const addCardMutation = useMutation({
    mutationFn: (name: string): Promise<Card> => createCard(name),
    onSuccess: (newCard: Card) => {
      // Update cache with the new card
      queryClient.setQueryData(["cards"], (oldData: Card[] = []) => {
        const updatedCards = [...oldData, newCard];
        return updatedCards;
      });
      
      // Get the current cards array after adding the new one
      const updatedCards = queryClient.getQueryData(["cards"]) as Card[];
      // Find the index of the newly added card
      const newIndex = updatedCards.findIndex(card => card.id === newCard.id);
      
      // Return the new card ID and index
      return { 
        newCardId: newCard.id, 
        newIndex: newIndex >= 0 ? newIndex : updatedCards.length - 1 
      } as AddCardResult;
    }
  });
  
  // Freeze a card
  const freezeCard = (cardId: string) => {
    freezeCardMutation.mutate({ cardId, frozen: true });
  };
  
  // Unfreeze a card
  const unfreezeCard = (cardId: string) => {
    freezeCardMutation.mutate({ cardId, frozen: false });
  };
  
  // Add new card - returns the new index to be set as active
  const addCard = async (name: string): Promise<AddCardResult> => {
    try {
      // Use mutateAsync but handle the transformation of the response
      const newCard = await addCardMutation.mutateAsync(name);
      
      // Get the current cards array after the mutation
      const updatedCards = queryClient.getQueryData(["cards"]) as Card[];
      // Find the index of the newly added card
      const newIndex = updatedCards.findIndex(card => card.id === newCard.id);
      
      // Construct and return the expected AddCardResult
      return {
        newCardId: newCard.id,
        newIndex: newIndex >= 0 ? newIndex : updatedCards.length - 1
      };
    } catch (error) {
      console.error("Failed to add card:", error);
      throw error;
    }
  };
  
  return {
    cards,
    isLoading,
    error,
    freezeCard,
    unfreezeCard,
    addCard,
    isFreezeLoading: freezeCardMutation.isPending,
    isAddCardLoading: addCardMutation.isPending,
  };
}
