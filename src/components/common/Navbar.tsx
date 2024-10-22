import React from 'react';
import { Dropdown } from '../ui';

// Define the type for NavbarItem
interface NavbarItem {
  title: string;
  items: {
    label: string;
    href: string;
  }[];
}

// Define the props type for Navbar component
interface NavbarProps {
  datas: NavbarItem[];
}

const Navbar: React.FC<NavbarProps> = ({ datas }) => {
  return (
    <nav className="hidden sm:flex mt-1">
      {datas.map((data, index) => {
        return (
          <Dropdown
            key={index}
            title={data.title}
            items={data.items}
            className="relative mx-1"
          />
        );
      })}
    </nav>
  );
};

export { Navbar };

