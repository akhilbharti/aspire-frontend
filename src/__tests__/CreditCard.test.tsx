
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CreditCard from "../components/CreditCard";

// Mock assets
vi.mock("../assets", () => ({
  aspireLogoWhite: "aspire-logo.svg",
  visaLogo: "visa-logo.svg"
}));

describe("CreditCard", () => {
  const defaultProps = {
    id: "123",
    name: "John Doe",
    lastFourDigits: "4567",
    expiry: "12/25",
    cvv: "123"
  };

  it("renders card with masked number by default", () => {
    render(<CreditCard {...defaultProps} />);
    
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("4567")).toBeInTheDocument();
    expect(screen.getByText("Thru: 12/25")).toBeInTheDocument();
    expect(screen.getByText("CVV: ***")).toBeInTheDocument();
    expect(screen.queryByText("5647 3411 2413 4567")).not.toBeInTheDocument();
  });

  it("shows full card number when showCardNumber is true", () => {
    render(<CreditCard {...defaultProps} showCardNumber={true} />);
    
    expect(screen.getByText("5647 3411 2413 4567")).toBeInTheDocument();
    expect(screen.getByText("CVV: 123")).toBeInTheDocument();
  });

  it("shows frozen state when card is frozen", () => {
    render(<CreditCard {...defaultProps} frozen={true} />);
    
    expect(screen.getByText("Frozen")).toBeInTheDocument();
  });

  it("never shows card number when card is frozen, even if showCardNumber is true", () => {
    render(<CreditCard {...defaultProps} frozen={true} showCardNumber={true} />);
    
    expect(screen.queryByText("5647 3411 2413 4567")).not.toBeInTheDocument();
    expect(screen.queryByText("CVV: 123")).not.toBeInTheDocument();
    expect(screen.getByText("CVV: ***")).toBeInTheDocument();
  });

  it("applies active styling when card is active", () => {
    const { container } = render(<CreditCard {...defaultProps} active={true} />);
    
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass("scale-100");
    expect(cardElement).not.toHaveClass("scale-90");
  });

  it("applies inactive styling when card is not active", () => {
    const { container } = render(<CreditCard {...defaultProps} active={false} />);
    
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass("scale-90");
    expect(cardElement).toHaveClass("opacity-60");
  });
});
