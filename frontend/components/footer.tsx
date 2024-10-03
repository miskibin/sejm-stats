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
    <footer className="bg-white dark:bg-gray-700 border-t-1 rounded-t py-4 text-neutral-700 dark:text-neutral-100">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={24}
              height={24}
              className="mr-2"
            />
            <span className="text-sm ">
              © 2024 Michał Skibiński. Wszelkie prawa zastrzeżone.
            </span>
          </div>
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-sm   mr-2">
              Hosting sponsorowany przez
            </span>
            <Link
              href="https://mikr.us/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 10.39"
                className="h-4 w-auto ml-2"
                aria-labelledby="mikrus-logo"
                role="img"
              >
                <title id="mikrus-logo">Mikr.us - Strona główna</title>
                <path
                  fill="#662d91"
                  d="M28.51 2.93a2.8 2.8 0 0 0-1.35.32 2.61 2.61 0 0 0-1 .88A2.33 2.33 0 0 0 24 2.93a2.5 2.5 0 0 0-1.24.29 2.31 2.31 0 0 0-.86.78l-.15-.91h-1.57v6.68h1.73V6.3a2.21 2.21 0 0 1 .43-1.44 1.38 1.38 0 0 1 1.12-.52 1.25 1.25 0 0 1 1.05.46 2.27 2.27 0 0 1 .34 1.33v3.64h1.73V6.3A2.21 2.21 0 0 1 27 4.86a1.39 1.39 0 0 1 1.13-.52 1.19 1.19 0 0 1 1 .46 2.27 2.27 0 0 1 .37 1.33v3.64h1.74V5.93a3.38 3.38 0 0 0-.71-2.31 2.58 2.58 0 0 0-2.02-.69ZM33.56 0a1.08 1.08 0 0 0-.78.28.89.89 0 0 0-.31.71.92.92 0 0 0 .31.72 1.08 1.08 0 0 0 .78.28 1.12 1.12 0 0 0 .78-.28 1 1 0 0 0 .3-.72.91.91 0 0 0-.3-.71 1.12 1.12 0 0 0-.78-.28ZM32.69 3.04h1.74v6.73h-1.74zM42.17 3.04h-2.06l-2.39 2.73V0h-1.74v9.77h1.74V6.39l2.73 3.38h2.17l-3.21-3.66 2.76-3.07zM47.61 2.93a2.74 2.74 0 0 0-1.48.38 2.93 2.93 0 0 0-1 1L45 3.04h-1.58v6.73h1.74V6.7a2.38 2.38 0 0 1 .25-1.2 1.41 1.41 0 0 1 .7-.62 3 3 0 0 1 1-.17h.48ZM48.32 7.82a1.09 1.09 0 0 0-.78.3 1 1 0 0 0 0 1.45 1.18 1.18 0 0 0 1.57 0 1 1 0 0 0 0-1.45 1.09 1.09 0 0 0-.79-.3ZM55.19 6.51a2 2 0 0 1-.47 1.42 1.53 1.53 0 0 1-1.2.52 1.33 1.33 0 0 1-1.1-.46 2.19 2.19 0 0 1-.35-1.33V3.04h-1.74v3.8A3.38 3.38 0 0 0 51 9.15a2.44 2.44 0 0 0 2 .78 2.64 2.64 0 0 0 1.39-.35 2.35 2.35 0 0 0 .9-1l.14 1.14h1.53V3.04h-1.77ZM63.65 6.63a2.16 2.16 0 0 0-.95-.58 10 10 0 0 0-1.29-.36 5.47 5.47 0 0 1-1-.33Q60 5.18 60 4.93a.57.57 0 0 1 .26-.47 1.28 1.28 0 0 1 .74-.24c.65 0 1 .25 1.12.75h1.65a2.31 2.31 0 0 0-.85-1.54 3 3 0 0 0-1.92-.5 3 3 0 0 0-2 .61 1.88 1.88 0 0 0-.71 1.5 1.35 1.35 0 0 0 .23.82 1.67 1.67 0 0 0 .6.55 4 4 0 0 0 .82.34c.3.09.59.17.88.23a6.78 6.78 0 0 1 1.06.31.57.57 0 0 1 .38.59.7.7 0 0 1-.26.53 1.3 1.3 0 0 1-.84.23 1.45 1.45 0 0 1-.93-.28 1.14 1.14 0 0 1-.44-.67H58a2.3 2.3 0 0 0 .49 1.19 2.59 2.59 0 0 0 1.09.81 3.83 3.83 0 0 0 1.57.29 3.7 3.7 0 0 0 1.51-.28 2.19 2.19 0 0 0 1-.79A1.84 1.84 0 0 0 64 7.74a1.62 1.62 0 0 0-.35-1.11Z"
                ></path>
                <path
                  fill="#ee7225"
                  d="M3.55 10.39H0l2.93-9.32h3.55l-2.93 9.32zM15.51 10.39l-2.93-9.32H8.6l-2.93 9.32h3.55l1.37-4.36 1.37 4.36h3.55z"
                ></path>
              </svg>
            </Link>
          </div>
          <div className="flex space-x-4">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-300 hover:text-white sm:px-1 md:px-2"
              >
                {link.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
