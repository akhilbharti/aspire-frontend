
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { cn } from "@/lib/utils";

interface CardBottomSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title: string;
  className?: string;
}

const CardBottomSheet: React.FC<CardBottomSheetProps> = ({
  isOpen,
  onOpenChange,
  children,
  title,
  className,
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [isDragging, setIsDragging] = useState(false);
  const [initialTouchY, setInitialTouchY] = useState<number | null>(null);
  const [currentHeight, setCurrentHeight] = useState<"collapsed" | "expanded">(
    "collapsed"
  );
  
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Focus trap
  const { focusRef } = useFocusTrap(isOpen);
  
  if (!isMobile) return null;
  
  // Handle drag events
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setInitialTouchY(e.touches[0].clientY);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || initialTouchY === null) return;
    
    const currentTouch = e.touches[0].clientY;
    const diff = currentTouch - initialTouchY;
    
    // Expanding
    if (diff < -50 && currentHeight === "collapsed") {
      setCurrentHeight("expanded");
      onOpenChange(true);
    }
    
    // Collapsing
    if (diff > 50 && currentHeight === "expanded") {
      setCurrentHeight("collapsed");
      onOpenChange(false);
    }
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
    setInitialTouchY(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onOpenChange(false);
      setCurrentHeight("collapsed");
    }
  };
  
  // Calculate height based on state
  const getHeight = () => {
    if (currentHeight === "expanded") {
      return "calc(90vh - env(safe-area-inset-top))";
    }
    return "104px"; // Peek height
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => {
              onOpenChange(false);
              setCurrentHeight("collapsed");
            }}
          />
          
          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-labelledby="card-details-title"
            className={cn(
              "fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_8px_0_rgba(0,0,0,0.06)] rounded-t-2xl z-50",
              className
            )}
            style={{ height: getHeight() }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            {/* Drag Handle */}
            <div 
              className="h-6 w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
            >
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            
            {/* Title */}
            <h2 
              id="card-details-title" 
              className="text-lg font-bold px-4 mb-2"
            >
              {title}
            </h2>
            
            {/* Content Area (Scrollable) */}
            <div 
              className={cn(
                "overflow-y-auto px-4 pb-safe",
                currentHeight === "expanded" ? "max-h-[calc(90vh-104px)]" : "max-h-[40px]"
              )}
              tabIndex={currentHeight === "expanded" ? 0 : -1}
              ref={focusRef}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CardBottomSheet;
