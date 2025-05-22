
import React from "react";
import { useCards } from "@/context/CardContext";
import { useMediaQuery } from "@/hooks/use-media-query";
import {freezeCardIcon, spendLimitIcon, gPayIcon, replaceCardIcon, deactivateCardIcon} from '../assets'

interface CardControlsProps {
  cardId: string;
  isFrozen: boolean;
}

const CardControls: React.FC<CardControlsProps> = ({
  cardId,
  isFrozen
}) => {
  const { freezeCard, unfreezeCard } = useCards();
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  const handleFreezeToggle = () => {
    if (!cardId) return;
    
    if (isFrozen) {
      unfreezeCard(cardId);
    } else {
      freezeCard(cardId);
    }
  };

  const controls = [
    {
      icon: <img src={freezeCardIcon} alt={isFrozen ? "Unfreeze card" : "Freeze card"} className="w-8 h-8" />,
      label: isFrozen ? "Unfreeze card" : "Freeze card",
      onClick: handleFreezeToggle,
      ariaLabel: isFrozen ? "Unfreeze your card" : "Freeze your card temporarily"
    },
    {
      icon: <img src={spendLimitIcon} alt="Set spend limit icon" className="w-8 h-8" />,
      label: "Set spend limit",
      onClick: () => {},
      ariaLabel: "Set spending limit for your card"
    },
    {
      icon: <img src={gPayIcon} alt="Add to Google Pay icon" className="w-8 h-8" />,
      label: "Add to GPay",
      onClick: () => {},
      ariaLabel: "Add your card to Google Pay"
    },
    {
      icon: <img src={replaceCardIcon} alt="Replace card icon" className="w-8 h-8" />,
      label: "Replace card",
      onClick: () => {},
      ariaLabel: "Replace your current card"
    },
    {
      icon: <img src={deactivateCardIcon} alt="Cancel card icon" className="w-8 h-8" />,
      label: "Cancel card",
      onClick: () => {},
      ariaLabel: "Cancel this card"
    }
  ];

  return (
    <div className={`${isMobile ? 'overflow-x-auto hide-scrollbar py-4 pl-4 w-full' : 'p-6 bg-[#EDF3FF] rounded-xl shadow-sm mt-6 w-full'}`}>
      <div className={`${isMobile ? 'flex space-x-4 pb-2' : 'flex justify-between flex-wrap gap-4'}`}>
        {controls.map((control, index) => (
          <button
            key={index}
            onClick={control.onClick}
            aria-label={control.ariaLabel}
            className={`flex ${isMobile ? 'flex-col min-w-[72px]' : 'flex-col'} items-center gap-3 transition-all hover:scale-110 ${isMobile ? '' : 'w-[72px]'}`}
            disabled={!cardId && index === 0} // Disable freeze/unfreeze if no card
          >
            <div className={`flex items-center justify-center w-14 h-14 rounded-full hover:bg-white/20 transition-colors`}>
              {control.icon}
            </div> 
            <span className="text-[13px] font-medium text-aspire-tabsActiveColor text-center w-full whitespace-normal">{control.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CardControls;
