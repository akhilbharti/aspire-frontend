
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import CarouselNavigation from "../components/carousel/CarouselNavigation";

describe("CarouselNavigation", () => {
  const mockOnNext = vi.fn();
  const mockOnPrevious = vi.fn();
  
  beforeEach(() => {
    mockOnNext.mockClear();
    mockOnPrevious.mockClear();
  });
  
  it("renders previous and next buttons", () => {
    render(
      <CarouselNavigation 
        onNext={mockOnNext} 
        onPrevious={mockOnPrevious}
        disabled={false}
      />
    );
    
    expect(screen.getByLabelText("Previous card")).toBeInTheDocument();
    expect(screen.getByLabelText("Next card")).toBeInTheDocument();
  });
  
  it("calls onNext when the next button is clicked", () => {
    render(
      <CarouselNavigation 
        onNext={mockOnNext} 
        onPrevious={mockOnPrevious}
        disabled={false}
      />
    );
    
    const nextButton = screen.getByLabelText("Next card");
    fireEvent.click(nextButton);
    
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });
  
  it("calls onPrevious when the previous button is clicked", () => {
    render(
      <CarouselNavigation 
        onNext={mockOnNext} 
        onPrevious={mockOnPrevious}
        disabled={false}
      />
    );
    
    const prevButton = screen.getByLabelText("Previous card");
    fireEvent.click(prevButton);
    
    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });
  
  it("disables buttons when disabled prop is true", () => {
    render(
      <CarouselNavigation 
        onNext={mockOnNext} 
        onPrevious={mockOnPrevious}
        disabled={true}
      />
    );
    
    expect(screen.getByLabelText("Previous card")).toBeDisabled();
    expect(screen.getByLabelText("Next card")).toBeDisabled();
  });
});
