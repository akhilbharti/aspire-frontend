
import React from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { downArrowIcon, downArrowIcon1, groupIcon } from '../assets';

interface CardDetailsProps {
  cardNumber: string;
  cardType: string;
  cardStatus: string;
  activeAccordion: string | null;
  onToggle: (value: string | null) => void;
}

const CardDetails: React.FC<CardDetailsProps> = ({
  cardNumber,
  cardType,
  cardStatus,
  activeAccordion,
  onToggle
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  const handleToggle = (value: string) => {
    onToggle(activeAccordion === value ? null : value);
  };

  return (
    <div className={`${isMobile ? 'bg-white rounded-xl p-4' : 'bg-white rounded-xl p-6 pb-0'} animate-fade-in min-h-[120px]`}>
      <Accordion 
        type="single" 
        value={activeAccordion || ""}
        collapsible 
        className="w-full"
        onValueChange={(value) => handleToggle(value)}
      >
        <AccordionItem value="card-details" className="border-none">
          <div className="bg-[#F5F9FF] border-[#F5F5F5] shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-md hover:bg-[#EDF3FF] transition-colors duration-200">
            <AccordionTrigger 
              className="py-4 px-4 hover:no-underline transition-all duration-200 hover:bg-opacity-80"
              aria-label="Toggle Card Information"
              aria-expanded={activeAccordion === "card-details"}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <img src={groupIcon} alt="Card information icon" className="w-5 h-5 mr-2" />
                  <span className="font-medium text-aspire-tabsActiveColor">Card information</span>
                </div>
                <img 
                  src={activeAccordion === "card-details" ? downArrowIcon1 : downArrowIcon} 
                  alt={activeAccordion === "card-details" ? "Collapse card information" : "Expand card information"} 
                  className="w-5 h-5 transition-transform"
                />
              </div>
            </AccordionTrigger>
          </div>
          <AccordionContent className="animate-slide-in px-4 border-[#FCFCFC] border-[1px] rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.08)] data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="py-2 space-y-5">
              <div className="grid grid-cols-2 text-sm">
                <span className="text-aspire-tabsActiveColor">Card number</span>
                <span className="font-medium text-right text-aspire-tabsActiveColor">{cardNumber}</span>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <span className="text-aspire-tabsActiveColor">Card type</span>
                <span className="font-medium text-right text-aspire-tabsActiveColor">{cardType}</span>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <span className="text-aspire-tabsActiveColor">Status</span>
                <span className="font-medium text-right text-aspire-tabsActiveColor">{cardStatus}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default React.memo(CardDetails);
