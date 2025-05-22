
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  disabled: boolean;
}

const CarouselNavigation: React.FC<CarouselNavigationProps> = ({
  onNext,
  onPrevious,
  disabled,
}) => {
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md hover:bg-gray-100"
        onClick={onPrevious}
        aria-label="Previous card"
        disabled={disabled}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md hover:bg-gray-100"
        onClick={onNext}
        aria-label="Next card"
        disabled={disabled}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </>
  );
};

export default CarouselNavigation;
