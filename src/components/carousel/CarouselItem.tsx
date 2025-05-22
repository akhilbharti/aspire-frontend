
import React from "react";
import CreditCard from "@/components/CreditCard";
import { Card } from "@/context/CardContext";

interface CarouselItemProps {
  card: Card;
  isActive: boolean;
  showCardNumber: boolean;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ 
  card, 
  isActive,
  showCardNumber
}) => {
  return (
    <div className="snap-center flex-shrink-0 flex justify-center w-full">
      <div className="w-full max-w-md">
        <CreditCard 
          id={card.id} 
          name={card.name} 
          lastFourDigits={card.lastFourDigits} 
          expiry={card.expiry} 
          cvv={card.cvv} 
          active={isActive}
          frozen={card.frozen} 
          showCardNumber={showCardNumber} 
        />
      </div>
    </div>
  );
};

export default CarouselItem;
