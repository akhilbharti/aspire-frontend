
import React from "react";
import { Link } from "react-router-dom";
import {aspireLogo,homeIcon,cardIcon,exchangeIcon,creditIcon,accountIcon} from '../assets'

const Sidebar = () => {
  return (
    <div className="bg-aspire-blue h-screen flex flex-col w-[300px] min-w-[300px] text-white">
      <div className="py-8 px-6">
        <img src={aspireLogo} alt="Aspire Logo" className="w-32 h-9 mr-2 inline-block" />
        
        <p className="text-base mt-5 text-white opacity-30">
          Trusted way of banking for 3,000+ <br />
          SMEs and startups in Singapore
        </p>
      </div>

      <nav className="flex-1 py-6" aria-label="Main Navigation">
        <ul className="space-y-7">
          <NavItem icon={<img src={homeIcon} alt="Home icon" className="w-6 h-6" />} label="Home" href="/" />
          <NavItem 
            icon={<img src={cardIcon} alt="Cards icon" className="w-6 h-6" />} 
            label="Cards" 
            href="/cards" 
            active 
          />
          <NavItem icon={<img src={exchangeIcon} alt="Payments icon" className="w-6 h-6" />} label="Payments" href="/payments" />
          <NavItem icon={<img src={creditIcon} alt="Credit icon" className="w-6 h-6" />} label="Credit" href="/credit" />
          <NavItem icon={<img src={accountIcon} alt="Settings icon" className="w-6 h-6" />} label="Settings" href="/settings" />
        </ul>
      </nav>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, href, active }) => {
  return (
    <li>
      <Link
        to={href}
        className={`flex items-center px-6 py-3 text-[16px] font-medium transition-colors hover:bg-sidebar-accent rounded-r-lg ${
          active 
            ? "text-aspire-green border-l-4 border-aspire-green" 
            : "text-gray-300 hover:text-white"
        }`}
        aria-current={active ? "page" : undefined}
      >
        <span className="mr-3">{icon}</span>
        {label}
      </Link>
    </li>
  );
};

export default Sidebar;
