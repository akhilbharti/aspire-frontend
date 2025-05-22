
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import CarouselDotIndicators from "../components/carousel/CarouselDotIndicators";

describe("CarouselDotIndicators", () => {
  const mockOnDotClick = vi.fn();
  
  beforeEach(() => {
    mockOnDotClick.mockClear();
  });
  
  it("renders correct number of dots", () => {
    render(
      <CarouselDotIndicators 
        total={3}
        activeIndex={0}
        onDotClick={mockOnDotClick}
        animatingToIndex={null}
        disabled={false}
      />
    );
    
    const dots = screen.getAllByRole("button", { name: /Go to card/i });
    expect(dots).toHaveLength(3);
  });
  
  it("highlights the active dot", () => {
    const { container } = render(
      <CarouselDotIndicators 
        total={3}
        activeIndex={1}
        onDotClick={mockOnDotClick}
        animatingToIndex={null}
        disabled={false}
      />
    );
    
    // Get all dots
    const dots = screen.getAllByRole("button", { name: /Go to card/i });
    
    // Check that the active dot has the active class
    expect(dots[1]).toHaveClass("bg-aspire-green");
    
    // Check that the inactive dots don't have the active class
    expect(dots[0]).not.toHaveClass("bg-aspire-green");
    expect(dots[2]).not.toHaveClass("bg-aspire-green");
  });
  
  it("calls onDotClick with the correct index when a dot is clicked", () => {
    render(
      <CarouselDotIndicators 
        total={3}
        activeIndex={0}
        onDotClick={mockOnDotClick}
        animatingToIndex={null}
        disabled={false}
      />
    );
    
    const secondDot = screen.getAllByRole("button", { name: /Go to card/i })[1];
    fireEvent.click(secondDot);
    
    expect(mockOnDotClick).toHaveBeenCalledWith(1);
  });
  
  it("returns null when total is 1 or less", () => {
    const { container } = render(
      <CarouselDotIndicators 
        total={1}
        activeIndex={0}
        onDotClick={mockOnDotClick}
        animatingToIndex={null}
        disabled={false}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });
  
  it("disables dot interaction when disabled prop is true", () => {
    render(
      <CarouselDotIndicators 
        total={3}
        activeIndex={0}
        onDotClick={mockOnDotClick}
        animatingToIndex={null}
        disabled={true}
      />
    );
    
    const dots = screen.getAllByRole("button", { name: /Go to card/i });
    expect(dots[0]).toBeDisabled();
    expect(dots[1]).toBeDisabled();
    expect(dots[2]).toBeDisabled();
  });
});
