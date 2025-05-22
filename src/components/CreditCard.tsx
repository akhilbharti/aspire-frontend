
import React from "react";
import { aspireLogoWhite, visaLogo } from "../assets";

interface CreditCardProps {
  id: string;
  name: string;
  lastFourDigits: string;
  expiry: string;
  cvv: string;
  active?: boolean;
  frozen?: boolean;
  showCardNumber?: boolean;
}

const CreditCard: React.FC<CreditCardProps> = ({
  id,
  name,
  lastFourDigits,
  expiry,
  cvv,
  active = true,
  frozen = false,
  showCardNumber = false
}) => {
  // Card number should only be shown if explicitly requested AND the card is not frozen
  const shouldShowCardNumber = showCardNumber && !frozen;
  
  const maskedDigits = shouldShowCardNumber 
    ? "5647 3411 2413 " + lastFourDigits 
    : <div className="flex space-x-4">
        <div className="credit-card-dots">
          <span></span><span></span><span></span><span></span>
        </div>
        <div className="credit-card-dots">
          <span></span><span></span><span></span><span></span>
        </div>
        <div className="credit-card-dots">
          <span></span><span></span><span></span><span></span>
        </div>
        <span className="text-white">{lastFourDigits}</span>
      </div>;

  return (
    <div className={`relative w-full max-w-md mx-auto transition-all duration-500 ${active ? 'scale-100' : 'scale-90 opacity-60'}`}>
      <div className={`bg-aspire-green text-white rounded-xl p-7 shadow-lg relative overflow-hidden transform transition-all duration-300 hover:shadow-xl ${frozen ? 'opacity-60 after:content-[""] after:absolute after:inset-0 after:bg-gray-800 after:bg-opacity-30 after:z-10' : ''}`}>
        {frozen && <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-aspire-green font-bold py-2 px-6 rounded-full z-20 text-sm uppercase tracking-wider">
            Frozen
          </div>}
        
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
          <div className="dot-pattern w-48 h-48"></div>
        </div>
        
        <div className="flex justify-end mb-10">
          <img src={aspireLogoWhite} alt="Aspire" className="h-8" />
        </div>

        <div className="mb-10 pl-[32px]">
          <h2 className="text-[20px] font-medium text-white">{name}</h2>
        </div>

        <div className="mb-6 pl-[32px]">
          {shouldShowCardNumber ? (
            <p className="text-[16px] tracking-[2px] font-normal text-white">{maskedDigits}</p>
          ) : (
            <div className="flex items-center space-x-4 text-[16px] tracking-[2px]">
              <div className="flex space-x-1">
                <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
                <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
                <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
                <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
              </div>
              <div className="flex space-x-1">
                <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
                <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
                <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
                <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
              </div>
              <div className="flex space-x-1">
                <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
                <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
                <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
                <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
              </div>
              <span className="text-white">{lastFourDigits}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center text-sm pl-[32px]">
          <div>
            <div className="text-white text-[14px] font-normal">Thru: {expiry}</div>
          </div>
          <div>
            <div className="text-white text-[14px] font-normal">CVV: {shouldShowCardNumber ? cvv : "***"}</div>
          </div>
          <div className="flex items-center">
            <img src={visaLogo} alt="Visa" className="h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
