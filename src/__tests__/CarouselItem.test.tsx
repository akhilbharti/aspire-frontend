
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CarouselItem from "../components/carousel/CarouselItem";
import { Card } from "@/context/CardContext";

// Mock the CreditCard component since we're only testing CarouselItem
vi.mock("@/components/CreditCard", () => ({
  default: ({ 
    id, 
    name, 
    lastFourDigits, 
    expiry, 
    cvv, 
    active, 
    frozen,
    showCardNumber 
  }: any) => (
    <div data-testid="credit-card">
      <div data-testid="credit-card-name">{name}</div>
      <div data-testid="credit-card-digits">{lastFourDigits}</div>
      <div data-testid="credit-card-active">{active ? "Active" : "Inactive"}</div>
      <div data-testid="credit-card-frozen">{frozen ? "Frozen" : "Not Frozen"}</div>
      <div data-testid="credit-card-show-number">{showCardNumber ? "Showing" : "Hidden"}</div>
    </div>
  )
}));

describe("CarouselItem", () => {
  const mockCard: Card = {
    id: "card-123",
    name: "John Doe",
    lastFourDigits: "4242",
    expiry: "12/25",
    cvv: "123",
    frozen: false
  };

  it("renders the carousel item correctly", () => {
    render(
      <CarouselItem 
        card={mockCard}
        isActive={true}
        showCardNumber={false}
      />
    );
    
    expect(screen.getByTestId("credit-card")).toBeInTheDocument();
    expect(screen.getByTestId("credit-card-name")).toHaveTextContent("John Doe");
    expect(screen.getByTestId("credit-card-digits")).toHaveTextContent("4242");
  });
  
  it("passes isActive prop to CreditCard component", () => {
    render(
      <CarouselItem 
        card={mockCard}
        isActive={true}
        showCardNumber={false}
      />
    );
    
    expect(screen.getByTestId("credit-card-active")).toHaveTextContent("Active");
  });
  
  it("passes showCardNumber prop to CreditCard component", () => {
    render(
      <CarouselItem 
        card={mockCard}
        isActive={true}
        showCardNumber={true}
      />
    );
    
    expect(screen.getByTestId("credit-card-show-number")).toHaveTextContent("Showing");
  });
  
  it("handles frozen card state", () => {
    const frozenCard = { ...mockCard, frozen: true };
    
    render(
      <CarouselItem 
        card={frozenCard}
        isActive={true}
        showCardNumber={false}
      />
    );
    
    expect(screen.getByTestId("credit-card-frozen")).toHaveTextContent("Frozen");
  });
});
