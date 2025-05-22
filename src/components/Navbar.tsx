
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";

interface NavbarProps {
  defaultTab?: string;
  onTabChange?: (value: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  defaultTab = "debit",
  onTabChange
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <TabsList className={`bg-transparent px-0 ${isMobile ? 'w-full justify-start border-b border-gray-200 pb-2' : ''}`}>
      <TabsTrigger
        value="debit"
        className="tab-trigger mr-7"
        onClick={() => handleTabChange("debit")}
      >
        My debit cards
      </TabsTrigger>

      <TabsTrigger
        value="company"
        className="tab-trigger"
        onClick={() => handleTabChange("company")}
      >
        All company cards
      </TabsTrigger>
    </TabsList>
  );
};

export default Navbar;
