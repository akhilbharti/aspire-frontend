
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TransactionItem from "../components/TransactionItem";

// Mock assets
vi.mock("../assets", () => ({
  businessFinanceIcon: "business-finance-icon.svg",
  flightsIcon: "flight-icon.svg",
  fileStorageIcon: "file-storage-icon.svg",
  nextArrow: "next-arrow-icon.svg",
  megaphoneIcon: "megaphone-icon.svg"
}));

describe("TransactionItem", () => {
  it("renders purchase transaction correctly", () => {
    render(
      <TransactionItem
        merchant="Amazon"
        date="20 May 2023"
        amount="35.99"
        isCredit={false}
        type="purchase"
      />
    );
    
    expect(screen.getByText("Amazon")).toBeInTheDocument();
    expect(screen.getByText("20 May 2023")).toBeInTheDocument();
    expect(screen.getByText("- S$ 35.99")).toBeInTheDocument();
    expect(screen.getByText("Charged to debit card")).toBeInTheDocument();
    
    // Check for the business finance icon
    const icons = document.querySelectorAll('img[src="business-finance-icon.svg"]');
    expect(icons.length).toBeGreaterThanOrEqual(1);
  });
  
  it("renders refund transaction correctly", () => {
    render(
      <TransactionItem
        merchant="Store Refund"
        date="15 May 2023"
        amount="20.00"
        isCredit={true}
        type="refund"
      />
    );
    
    expect(screen.getByText("Store Refund")).toBeInTheDocument();
    expect(screen.getByText("15 May 2023")).toBeInTheDocument();
    expect(screen.getByText("+ S$ 20.00")).toBeInTheDocument();
    expect(screen.getByText("Refund to debit card")).toBeInTheDocument();
    
    // Check for the business finance icon
    const icons = document.querySelectorAll('img[src="business-finance-icon.svg"]');
    expect(icons.length).toBeGreaterThanOrEqual(1);
  });
  
  it("renders travel transaction correctly", () => {
    render(
      <TransactionItem
        merchant="Airlines"
        date="10 May 2023"
        amount="250.00"
        isCredit={false}
        type="travel"
      />
    );
    
    expect(screen.getByText("Airlines")).toBeInTheDocument();
    expect(screen.getByText("10 May 2023")).toBeInTheDocument();
    expect(screen.getByText("- S$ 250.00")).toBeInTheDocument();
    expect(screen.getByText("Charged to debit card")).toBeInTheDocument();
    
    // Check for the flight icon (for travel type)
    const icon = document.querySelector('img[src="flight-icon.svg"]');
    expect(icon).toBeInTheDocument();
  });
  
  it("applies green text for credit transactions", () => {
    const { container } = render(
      <TransactionItem
        merchant="Refund"
        date="10 May 2023"
        amount="50.00"
        isCredit={true}
        type="refund"
      />
    );
    
    const amountText = screen.getByText("+ S$ 50.00");
    expect(amountText).toHaveClass("text-aspire-green");
  });
});
