
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CardBottomSheet from "@/components/CardBottomSheet";

const CardBottomSheetExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>
        Open Card Bottom Sheet
      </Button>
      
      <CardBottomSheet
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Card Details"
      >
        <div className="space-y-4">
          <div className="flex overflow-x-auto py-3 gap-3 pb-4 hide-scrollbar">
            {/* First row of action chips that are visible in collapsed state */}
            <Button variant="outline" className="whitespace-nowrap">Freeze Card</Button>
            <Button variant="outline" className="whitespace-nowrap">Set Limit</Button>
            <Button variant="outline" className="whitespace-nowrap">Deactivate</Button>
          </div>
          
          <div className="space-y-4 pt-4">
            {/* Content visible when expanded */}
            <p>Card Number: **** **** **** 1234</p>
            <p>Expiry Date: 04/25</p>
            <p>Name on Card: John Doe</p>
            <p>CVV: ***</p>
            
            {/* Add many items to demonstrate scrolling */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="p-4 bg-gray-100 rounded-lg">
                Item {i + 1}
              </div>
            ))}
          </div>
        </div>
      </CardBottomSheet>
    </div>
  );
};

export default CardBottomSheetExample;
