
import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Card } from "@/context/CardContext";
import CarouselNavigation from "./carousel/CarouselNavigation";
import CarouselDotIndicators from "./carousel/CarouselDotIndicators";
import CarouselItem from "./carousel/CarouselItem";
import { useCarousel } from "@/hooks/use-carousel";

interface CardCarouselProps {
  cards: Card[];
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;
  showCardNumber: boolean;
}

const CardCarousel: React.FC<CardCarouselProps> = ({
  cards,
  activeCardIndex,
  setActiveCardIndex,
  showCardNumber
}) => {
  const [visibleCardIndex, setVisibleCardIndex] = useState(activeCardIndex);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isNavigatingRef = useRef(false);
  
  const { 
    goToNext,
    goToPrevious,
    goToFirst,
    goToLast,
    handleDotClick,
    isTransitioning,
    animatingToIndex,
    setAnimatingToIndex,
    setIsTransitioning
  } = useCarousel({ 
    itemCount: cards.length, 
    activeIndex: activeCardIndex, 
    onChange: setActiveCardIndex 
  });

  // Track scroll to update visible card
  const handleScroll = useCallback(() => {
    if (carouselRef.current && !animatingToIndex && !isNavigatingRef.current) {
      const scrollContainer = carouselRef.current;
      const containerWidth = scrollContainer.offsetWidth;
      const scrollPosition = scrollContainer.scrollLeft;
      
      // Calculate which card is most visible based on scroll position
      const newIndex = Math.round(scrollPosition / containerWidth);
      if (newIndex !== visibleCardIndex && newIndex >= 0 && newIndex < cards.length) {
        console.log(`Scroll detected: ${newIndex}`);
        setVisibleCardIndex(newIndex);
        setActiveCardIndex(newIndex);
      }
    }
  }, [animatingToIndex, cards.length, setActiveCardIndex, visibleCardIndex]);

  // Scroll to a specific card with looping support
  const scrollToCard = useCallback((index: number) => {
    if (!carouselRef.current || cards.length === 0) {
      console.log('Carousel not ready or no cards');
      return;
    }
    
    // Handle index bounds with looping
    let targetIndex = index;
    if (targetIndex < 0) {
      console.log(`Looping to last card (${cards.length - 1})`);
      targetIndex = cards.length - 1;
    }
    if (targetIndex >= cards.length) {
      console.log('Looping to first card (0)');
      targetIndex = 0;
    }
    
    const scrollContainer = carouselRef.current;
    const cardWidth = scrollContainer.offsetWidth;
    const targetScrollPosition = cardWidth * targetIndex;
    
    console.log(`Scrolling to card ${targetIndex} (position: ${targetScrollPosition}px)`);
    
    try {
      scrollContainer.scrollTo({
        left: targetScrollPosition,
        behavior: 'smooth'
      });
    } catch (error) {
      console.error('Error during scroll:', error);
      // Fallback for browsers that don't support smooth scrolling
      scrollContainer.scrollLeft = targetScrollPosition;
    }
  }, [cards.length]);

  // Sync visible index with active index when changed programmatically
  useLayoutEffect(() => {
    setVisibleCardIndex(activeCardIndex);
    console.log(`Active card changed to: ${activeCardIndex}`);
    
    // Ensure card is scrolled into view when activeCardIndex changes with a slight delay
    // to ensure DOM is ready, especially for new cards
    const timer = setTimeout(() => {
      scrollToCard(activeCardIndex);
      
      // Reset animating index after animation completes
      setTimeout(() => {
        setAnimatingToIndex(null);
      }, 400);
    }, 100); // Increased delay to ensure DOM is ready
    
    return () => {
      clearTimeout(timer);
    };
  }, [activeCardIndex, cards.length, scrollToCard]);

  // Special animation when adding a new card
  useEffect(() => {
    if (cards.length > 0 && activeCardIndex === cards.length - 1 && animatingToIndex === null) {
      console.log('New card detected, applying special animation');
      // Add visual feedback for new card - it's already scrolled into view
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  }, [cards.length, activeCardIndex, animatingToIndex, setIsTransitioning]);
  
  // Set up scroll event listener
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      return () => carousel.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);
  
  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Home') {
        goToFirst();
      } else if (e.key === 'End') {
        goToLast();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, goToFirst, goToLast]);
  
  // Don't show anything if there are no cards
  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full mt-0">
      <div className="relative">
        {/* Navigation arrows - only show if we have more than one card */}
        {cards.length > 1 && (
          <CarouselNavigation 
            onPrevious={goToPrevious}
            onNext={goToNext}
            disabled={isTransitioning}
          />
        )}
        
        <div 
          ref={carouselRef} 
          className={`flex overflow-x-auto snap-x snap-mandatory hide-scrollbar py-4 scroll-smooth
            ${isTransitioning ? 'transition-all duration-300' : ''}`}
          style={{ scrollBehavior: 'smooth' }}
        >
          {cards.map((card, index) => (
            <CarouselItem 
              key={card.id}
              card={card}
              isActive={index === activeCardIndex}
              showCardNumber={showCardNumber}
            />
          ))}
        </div>
        
        <CarouselDotIndicators
          total={cards.length}
          activeIndex={visibleCardIndex}
          onDotClick={handleDotClick}
          animatingToIndex={animatingToIndex}
          disabled={isTransitioning}
        />
      </div>
    </div>
  );
};

export default React.memo(CardCarousel);
