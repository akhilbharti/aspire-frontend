
import React from "react";

interface CarouselDotIndicatorsProps {
  total: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
  animatingToIndex: number | null;
  disabled: boolean;
}

const CarouselDotIndicators: React.FC<CarouselDotIndicatorsProps> = ({
  total,
  activeIndex,
  onDotClick,
  animatingToIndex,
  disabled,
}) => {
  if (total <= 1) return null;
  
  return (
    <div className="mt-5 flex justify-center space-x-3">
      {Array.from({ length: total }).map((_, index) => (
        <button 
          key={index} 
          onClick={() => onDotClick(index)}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-200 focus:outline-none
            ${activeIndex === index 
              ? 'bg-aspire-green scale-125' 
              : 'bg-gray-300 hover:bg-gray-400'}`}
          aria-label={`Go to card ${index + 1}`} 
          data-animating={animatingToIndex === index ? 'true' : 'false'}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default CarouselDotIndicators;
