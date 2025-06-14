"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useMediaQuery } from "@/lib/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 1023px)");

  const menu = [
    {
      name: "Invest",
      subMenu: [
        {
          name: "Start Investing",
          href: "#",
        },
        {
          name: "How it works",
          href: "#",
        },
        {
          name: "Screening Process",
          href: "#",
        },
      ],
      hidden: false,
    },
    {
      name: "About Us",
      subMenu: [
        {
          name: "Who we are",
          href: "#",
        },
        {
          name: "Careers",
          href: "#",
        },
        {
          name: "Contacts",
          href: "#",
        },
        {
          name: "In the News",
          href: "#",
        },
      ],
      hidden: false,
    },
    {
      name: "Resources",
      subMenu: [
        {
          name: "Blogs",
          href: "#",
        },
        {
          name: "Videos",
          href: "#",
        },
        {
          name: "FAQ's",
          href: "#",
        },
        {
          name: "Glossary terms",
          href: "#",
        },
      ],
      hidden: false,
    },
    {
      name: "Sponsor",
      subMenu: [
        {
          name: "Raise capital",
          href: "#",
        },
        {
          name: "Post Fundraise",
          href: "#",
        },
        {
          name: "Request Info",
          href: "#",
        },
      ],
      hidden: false,
    },
    {
      name: "Testimonials",
      href: "#",
      hidden: false,
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
      setOpenSubmenu(null);
    }
  };

  const toggleSubmenu = (menuName: string) => {
    setOpenSubmenu(openSubmenu === menuName ? null : menuName);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenSubmenu(null);
  };

  return (
    <>
      <header className='sticky top-0 z-50 w-full bg-white shadow-sm'>
        <div className='container mx-auto px-4 py-3 sm:px-6 lg:px-20 lg:py-8'>
          <div className='flex items-center justify-between'>
            {/* Logo */}
            <div className='flex-shrink-0'>
              <Image
                src='/images/logo-dark.png'
                alt='logo'
                width={isMobile ? 160 : 210}
                height={isMobile ? 115 : 150}
                priority
                loading='eager'
                className='h-auto w-auto'
              />
            </div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <NavigationMenu viewport={false}>
                <NavigationMenuList>
                  {menu.map((item) => (
                    <NavigationMenuItem key={item.name}>
                      {item.href ? (
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className='px-4 py-2 font-semibold text-text-muted transition-colors hover:text-black'
                          >
                            {item.name}
                          </Link>
                        </NavigationMenuLink>
                      ) : (
                        <>
                          <NavigationMenuTrigger className='font-semibold text-text-muted transition-colors hover:text-black'>
                            {item.name}
                          </NavigationMenuTrigger>
                          {item.subMenu && (
                            <NavigationMenuContent className='min-w-[200px] bg-white p-0'>
                              {item.subMenu.map((subItem, index) => (
                                <NavigationMenuLink
                                  key={index}
                                  asChild
                                  className='block px-4 py-3 font-semibold text-text-muted transition-all hover:bg-primary hover:text-white'
                                >
                                  <Link href={subItem.href}>{subItem.name}</Link>
                                </NavigationMenuLink>
                              ))}
                            </NavigationMenuContent>
                          )}
                        </>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            )}

            {/* Desktop Auth Buttons */}
            {!isMobile && (
              <div className='flex items-center space-x-4 xl:space-x-6'>
                <Button variant='link' className='px-0 text-sm font-semibold'>
                  <Link href='/login'>Log in</Link>
                </Button>
                <Button className='px-6 py-2 text-sm font-semibold xl:px-8'>
                  <Link href='/register'>Sign up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={toggleMobileMenu}
                className='relative z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 transition-all duration-300 hover:bg-gray-200'
                aria-label='Toggle mobile menu'
              >
                <div className='relative h-6 w-6'>
                  <span
                    className={`absolute left-0 top-1 h-0.5 w-6 bg-gray-800 transition-all duration-300 ${
                      isMobileMenuOpen ? "top-3 rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-3 h-0.5 w-6 bg-gray-800 transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-5 h-0.5 w-6 bg-gray-800 transition-all duration-300 ${
                      isMobileMenuOpen ? "top-3 -rotate-45" : ""
                    }`}
                  />
                </div>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-40 transition-all duration-300 ${
            isMobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              isMobileMenuOpen ? "bg-opacity-50" : "bg-opacity-0"
            }`}
            onClick={closeMobileMenu}
          />

          {/* Mobile Menu */}
          <div
            className={`absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className='flex h-full flex-col'>
              {/* Mobile Menu Header */}
              <div className='flex items-center justify-between border-b border-gray-200 p-4'>
                <Image src='/images/logo-dark.png' alt='logo' width={140} height={100} className='h-auto w-auto' />
                <button
                  onClick={closeMobileMenu}
                  className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200'
                  aria-label='Close menu'
                >
                  <X className='h-5 w-5 text-gray-600' />
                </button>
              </div>

              {/* Mobile Menu Items */}
              <div className='flex-1 overflow-y-auto px-4 py-4'>
                <nav className='space-y-2'>
                  {menu.map((item) => (
                    <div key={item.name} className='border-b border-gray-100 pb-2 last:border-b-0'>
                      {item.href ? (
                        <Link
                          href={item.href}
                          onClick={closeMobileMenu}
                          className='block py-3 text-lg font-semibold text-text-muted transition-colors hover:text-primary'
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <>
                          <button
                            onClick={() => toggleSubmenu(item.name)}
                            className='flex w-full items-center justify-between py-3 text-left text-lg font-semibold text-text-muted transition-colors hover:text-primary'
                          >
                            {item.name}
                            <ChevronDown
                              className={`h-5 w-5 transition-transform duration-200 ${
                                openSubmenu === item.name ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {item.subMenu && (
                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                openSubmenu === item.name ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                              }`}
                            >
                              <div className='ml-4 space-y-1 border-l-2 border-gray-100 pl-4'>
                                {item.subMenu.map((subItem, index) => (
                                  <Link
                                    key={index}
                                    href={subItem.href}
                                    onClick={closeMobileMenu}
                                    className='block py-2 text-base text-text-muted transition-colors hover:text-primary'
                                  >
                                    {subItem.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Mobile Auth Buttons */}
              <div className='space-y-3 border-t border-gray-200 p-4'>
                <Button variant='outline' className='w-full py-3 text-base font-semibold' onClick={closeMobileMenu}>
                  <Link href='/login'>Log in</Link>
                </Button>
                <Button className='w-full py-3 text-base font-semibold' onClick={closeMobileMenu}>
                  <Link href='/register'>Sign up</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
