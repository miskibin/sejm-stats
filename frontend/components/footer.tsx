import React from "react";
import Link from "next/link";
import Image from "next/image";
type FooterLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

type FooterProps = {
  links: FooterLink[];
};

const Footer: React.FC<FooterProps> = ({ links }) => {
  return (
    <footer className="bg-white border-t-1 rounded-t  py-4">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={24}
            height={24}
            className="mr-2"
          />
          <span className="text-sm text-neutral-700">
            © 2024 Michał Skibiński. Wszelkie prawa zastrzeżone.
          </span>
        </div>
        <div className="flex space-x-4">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-gray-300 hover:text-white px-2"
            >
              {link.icon}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
