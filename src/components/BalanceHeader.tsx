
import React from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { boxIcon } from '../assets'

interface BalanceHeaderProps {
  onAddCardClick: () => void;
}

const BalanceHeader: React.FC<BalanceHeaderProps> = ({ onAddCardClick }) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} items-end md:items-end mb-6`}>
      <div>
        <h1 className="text-[14px] text-aspire-tabsActiveColor font-open-sans font-normal">Available balance</h1>
        <div className="flex items-center mt-2.5">
          <div className="bg-aspire-green text-white text-[13px] font-medium px-2 py-1 rounded mr-2">
            S$
          </div>
          <span className="text-[26px] font-bold text-aspire-tabsActiveColor font-open-sans">3,000</span>
        </div>
      </div>
      <Button 
        className={`mb-[9px] bg-aspire-blueBtn hover:bg-aspire-blue/90 flex rounded items-center text-[13px] font-medium py-3 px-4 ${isMobile ? 'mt-6 w-full justify-center' : ''}`}
        onClick={onAddCardClick}
        aria-label="Add a new card"
      >
        <img src={boxIcon} alt="Add new card icon" className="mr-1 w-4 h-4" />
        New card
      </Button>
    </div>
  );
};

export default BalanceHeader;
