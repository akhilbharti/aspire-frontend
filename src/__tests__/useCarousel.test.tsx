
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCarousel } from "@/hooks/use-carousel";

// Mock timer functions
vi.useFakeTimers();

describe("useCarousel", () => {
  const mockOnChange = vi.fn();
  
  beforeEach(() => {
    mockOnChange.mockClear();
    vi.clearAllTimers();
  });
  
  it("initializes with correct default values", () => {
    const { result } = renderHook(() => 
      useCarousel({ 
        itemCount: 3, 
        activeIndex: 0,
        onChange: mockOnChange 
      })
    );
    
    expect(result.current.isTransitioning).toBe(false);
    expect(result.current.animatingToIndex).toBe(null);
  });
  
  it("navigates to the next item", () => {
    const { result } = renderHook(() => 
      useCarousel({ 
        itemCount: 3, 
        activeIndex: 0,
        onChange: mockOnChange 
      })
    );
    
    act(() => {
      result.current.goToNext();
    });
    
    expect(mockOnChange).toHaveBeenCalledWith(1);
    expect(result.current.isTransitioning).toBe(true);
    expect(result.current.animatingToIndex).toBe(1);
    
    // Fast forward to clear the transition state
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    expect(result.current.isTransitioning).toBe(false);
  });
  
  it("navigates to the previous item", () => {
    const { result } = renderHook(() => 
      useCarousel({ 
        itemCount: 3, 
        activeIndex: 1,
        onChange: mockOnChange 
      })
    );
    
    act(() => {
      result.current.goToPrevious();
    });
    
    expect(mockOnChange).toHaveBeenCalledWith(0);
    expect(result.current.isTransitioning).toBe(true);
  });
  
  it("loops to the last item when going previous from the first item", () => {
    const { result } = renderHook(() => 
      useCarousel({ 
        itemCount: 3, 
        activeIndex: 0,
        onChange: mockOnChange 
      })
    );
    
    act(() => {
      result.current.goToPrevious();
    });
    
    expect(mockOnChange).toHaveBeenCalledWith(2); // Should wrap around to the last item
  });
  
  it("loops to the first item when going next from the last item", () => {
    const { result } = renderHook(() => 
      useCarousel({ 
        itemCount: 3, 
        activeIndex: 2,
        onChange: mockOnChange 
      })
    );
    
    act(() => {
      result.current.goToNext();
    });
    
    expect(mockOnChange).toHaveBeenCalledWith(0); // Should wrap around to the first item
  });
  
  it("prevents navigation during transition", () => {
    const { result } = renderHook(() => 
      useCarousel({ 
        itemCount: 3, 
        activeIndex: 0,
        onChange: mockOnChange 
      })
    );
    
    act(() => {
      result.current.goToNext(); // First navigation
      result.current.goToNext(); // Should be ignored during transition
    });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1); // Only called once
    
    // Fast forward to clear the transition state
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    // Now navigation should work again
    act(() => {
      result.current.goToNext();
    });
    
    expect(mockOnChange).toHaveBeenCalledTimes(2);
  });
  
  it("handles dot indicator clicks correctly", () => {
    const { result } = renderHook(() => 
      useCarousel({ 
        itemCount: 5, 
        activeIndex: 0,
        onChange: mockOnChange 
      })
    );
    
    act(() => {
      result.current.handleDotClick(3); // Click on the fourth dot
    });
    
    expect(mockOnChange).toHaveBeenCalledWith(3);
    expect(result.current.animatingToIndex).toBe(3);
  });
  
  it("navigates to first and last items correctly", () => {
    const { result } = renderHook(() => 
      useCarousel({ 
        itemCount: 5, 
        activeIndex: 2,
        onChange: mockOnChange 
      })
    );
    
    act(() => {
      result.current.goToFirst();
    });
    
    expect(mockOnChange).toHaveBeenCalledWith(0);
    
    // Clear the transition
    act(() => {
      vi.advanceTimersByTime(500);
      mockOnChange.mockClear();
    });
    
    act(() => {
      result.current.goToLast();
    });
    
    expect(mockOnChange).toHaveBeenCalledWith(4); // Last item (index 4)
  });
});
