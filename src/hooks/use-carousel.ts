
import { useCallback, useRef, useState } from "react";

interface UseCarouselProps {
  itemCount: number;
  activeIndex: number;
  onChange: (index: number) => void;
}

export function useCarousel({ 
  itemCount, 
  activeIndex, 
  onChange 
}: UseCarouselProps) {
  const [animatingToIndex, setAnimatingToIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isNavigatingRef = useRef(false);

  // Debounced navigation to prevent rapid clicks
  const navigate = useCallback((targetIndex: number) => {
    if (isNavigatingRef.current || isTransitioning) {
      console.log('Navigation in progress, skipping');
      return;
    }
    
    console.log(`Navigating from ${activeIndex} to ${targetIndex}`);
    isNavigatingRef.current = true;
    setIsTransitioning(true);
    setAnimatingToIndex(targetIndex);
    onChange(targetIndex);
    
    // Reset navigation lock after animation completes
    setTimeout(() => {
      isNavigatingRef.current = false;
      setIsTransitioning(false);
    }, 500); // Slightly longer than animation duration
  }, [activeIndex, onChange, isTransitioning]);

  // Navigate to previous item with looping
  const goToPrevious = useCallback(() => {
    const prevIndex = activeIndex === 0 ? itemCount - 1 : activeIndex - 1;
    console.log(`Going to previous card: ${prevIndex} (from ${activeIndex})`);
    navigate(prevIndex);
  }, [activeIndex, itemCount, navigate]);
  
  // Navigate to next item with looping
  const goToNext = useCallback(() => {
    const nextIndex = activeIndex === itemCount - 1 ? 0 : activeIndex + 1;
    console.log(`Going to next card: ${nextIndex} (from ${activeIndex})`);
    navigate(nextIndex);
  }, [activeIndex, itemCount, navigate]);
  
  // Direct navigation to first or last item
  const goToFirst = useCallback(() => {
    console.log('Going to first card');
    navigate(0);
  }, [navigate]);
  
  const goToLast = useCallback(() => {
    if (itemCount === 0) return;
    console.log('Going to last card');
    navigate(itemCount - 1);
  }, [itemCount, navigate]);

  // Handle dot indicator click
  const handleDotClick = useCallback((index: number) => {
    console.log(`Dot clicked: ${index}`);
    navigate(index);
  }, [navigate]);

  return {
    navigate,
    goToPrevious,
    goToNext,
    goToFirst,
    goToLast,
    handleDotClick,
    isTransitioning,
    animatingToIndex,
    setAnimatingToIndex,
    setIsTransitioning
  };
}
