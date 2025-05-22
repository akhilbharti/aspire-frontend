
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import AddCardModal from "../components/AddCardModal";
import { useCards } from "@/context/CardContext";
import { toast } from "sonner";

// Mock context and toast
vi.mock("@/context/CardContext", () => ({
  useCards: vi.fn()
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  }
}));

describe("AddCardModal", () => {
  const mockAddCard = vi.fn();
  const mockOnOpenChange = vi.fn();
  
  beforeEach(() => {
    (useCards as any).mockReturnValue({
      addCard: mockAddCard
    });
    mockAddCard.mockClear();
    mockOnOpenChange.mockClear();
    (toast.success as any).mockClear();
  });
  
  it("renders the modal when open is true", () => {
    render(<AddCardModal open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByText("Add New Card")).toBeInTheDocument();
  });
  
  it("does not render the modal when open is false", () => {
    render(<AddCardModal open={false} onOpenChange={mockOnOpenChange} />);
    expect(screen.queryByText("Add New Card")).not.toBeInTheDocument();
  });
  
  it("validates form input - rejects empty name", async () => {
    const user = userEvent.setup();
    render(<AddCardModal open={true} onOpenChange={mockOnOpenChange} />);
    
    await user.click(screen.getByRole("button", { name: "Add Card" }));
    
    expect(await screen.findByText("Name must be at least 2 characters")).toBeInTheDocument();
    expect(mockAddCard).not.toHaveBeenCalled();
  });
  
  it("validates form input - rejects invalid characters", async () => {
    const user = userEvent.setup();
    render(<AddCardModal open={true} onOpenChange={mockOnOpenChange} />);
    
    await user.type(screen.getByLabelText("Name on Card"), "Test123");
    await user.click(screen.getByRole("button", { name: "Add Card" }));
    
    expect(await screen.findByText("Card name can only contain letters and spaces")).toBeInTheDocument();
    expect(mockAddCard).not.toHaveBeenCalled();
  });
  
  it("submits valid form data", async () => {
    const user = userEvent.setup();
    render(<AddCardModal open={true} onOpenChange={mockOnOpenChange} />);
    
    await user.type(screen.getByLabelText("Name on Card"), "John Doe");
    await user.click(screen.getByRole("button", { name: "Add Card" }));
    
    await waitFor(() => {
      expect(mockAddCard).toHaveBeenCalledWith("John Doe");
      expect(toast.success).toHaveBeenCalledWith("New card added successfully");
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });
  
  it("closes modal when cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(<AddCardModal open={true} onOpenChange={mockOnOpenChange} />);
    
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
