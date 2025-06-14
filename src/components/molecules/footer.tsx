import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className='bg-primary pt-12 text-white sm:pt-16 lg:pt-20'>
      <div className='container mx-auto max-w-full px-4 sm:px-8 lg:px-16'>
        <div className='grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-2 lg:grid-cols-6 lg:gap-16'>
          {/* Logo and Company Info */}
          <div className='col-span-1 space-y-4 md:col-span-2 lg:space-y-6'>
            <div>
              <Image
                src='/images/logo-light.png'
                alt='RC Brown Capital'
                width={180}
                height={43}
                className='h-auto w-auto sm:w-[200px] lg:w-[228px]'
              />
            </div>
            <p className='text-sm text-white'>An online real estate investing platform</p>

            {/* Contact Info Box */}
            <div className='max-w-full space-y-3 rounded-[10px] bg-[#254773] px-4 py-6 sm:max-w-[300px] sm:space-y-4 sm:px-5 sm:py-8'>
              <div className='flex items-start'>
                <Image
                  src='/icons/location.svg'
                  alt='Map Pin'
                  className='mr-3 mt-0.5 flex-shrink-0'
                  width={16}
                  height={16}
                />
                <p className='text-sm font-light'>687 Adeola Hopewell Street, Victoria Island, Lagos.</p>
              </div>
              <div className='flex items-center'>
                <Image src='/icons/call.svg' alt='Phone' className='mr-3 mt-0.5 flex-shrink-0' width={16} height={16} />
                <p className='text-sm font-light'>07080185222</p>
              </div>
              <div className='flex items-center'>
                <Image src='/icons/mail.svg' alt='Mail' className='mr-3 mt-0.5 flex-shrink-0' width={16} height={16} />
                <p className='text-sm font-light'>support@singlereos.com</p>
              </div>
            </div>
          </div>

          <div className='col-span-1 grid grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-4 lg:grid-cols-4 lg:gap-8'>
            {/* About Links */}
            <div>
              <h3 className='mb-3 text-base font-semibold sm:mb-4 sm:text-lg'>ABOUT</h3>
              <ul className='space-y-2'>
                <li>
                  <Link href='#' className='text-sm text-gray-300 transition-colors hover:text-white'>
                    Who we are
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-sm text-gray-300 transition-colors hover:text-white'>
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-sm text-gray-300 transition-colors hover:text-white'>
                    Contacts
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-sm text-gray-300 transition-colors hover:text-white'>
                    In the News
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className='mb-3 text-base font-semibold sm:mb-4 sm:text-lg'>QUICK LINKS</h3>
              <ul className='space-y-2'>
                <li>
                  <Link href='#' className='text-sm text-gray-300 transition-colors hover:text-white'>
                    Properties
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-sm text-gray-300 transition-colors hover:text-white'>
                    Agents
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-sm text-gray-300 transition-colors hover:text-white'>
                    Stories
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-sm text-gray-300 transition-colors hover:text-white'>
                    Our Portfolio
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-sm text-gray-300 transition-colors hover:text-white'>
                    Contacts
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-sm text-gray-300 transition-colors hover:text-white'>
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-sm text-gray-300 transition-colors hover:text-white'>
                    Posting Policy
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-sm text-gray-300 transition-colors hover:text-white'>
                    Policy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Invest Links and Social Media */}
            <div>
              <h3 className='mb-3 text-base font-semibold sm:mb-4 sm:text-lg'>INVEST</h3>
              <ul className='space-y-2'>
                <li>
                  <Link href='#' className='text-sm text-gray-300 transition-colors hover:text-white'>
                    Browse Marketplace
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-sm text-gray-300 transition-colors hover:text-white'>
                    Ways To Invest
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-sm text-gray-300 transition-colors hover:text-white'>
                    Marketplace Performance
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-sm text-gray-300 transition-colors hover:text-white'>
                    Investment Thesis
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-sm text-gray-300 transition-colors hover:text-white'>
                    Review Process
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-sm text-gray-300 transition-colors hover:text-white'>
                    Our Investor Commitments
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='mb-3 text-base font-semibold sm:mb-4 sm:text-lg'>FOLLOW US</h3>
              <ul className='space-y-3 sm:space-y-4'>
                <li>
                  <Link href='#' className='flex items-center text-sm text-gray-300 transition-colors hover:text-white'>
                    <Image src='/icons/facebook.svg' alt='Facebook' className='mr-3' width={16} height={16} />
                    <span>Facebook</span>
                  </Link>
                </li>
                <li>
                  <Link href='#' className='flex items-center text-sm text-gray-300 transition-colors hover:text-white'>
                    <Image src='/icons/twitter.svg' alt='Twitter' className='mr-3' width={16} height={16} />
                    <span>Twitter</span>
                  </Link>
                </li>
                <li>
                  <Link href='#' className='flex items-center text-sm text-gray-300 transition-colors hover:text-white'>
                    <Image src='/icons/instagram.svg' alt='Instagram' className='mr-3' width={16} height={16} />
                    <span>Instagram</span>
                  </Link>
                </li>
                <li>
                  <Link href='#' className='flex items-center text-sm text-gray-300 transition-colors hover:text-white'>
                    <Image src='/icons/linkedin.svg' alt='LinkedIn' className='mr-3' width={16} height={16} />
                    <span>LinkedIn</span>
                  </Link>
                </li>
                <li>
                  <Link href='#' className='flex items-center text-sm text-gray-300 transition-colors hover:text-white'>
                    <Image src='/icons/youtube.svg' alt='YouTube' className='mr-3' width={16} height={16} />
                    <span>YouTube</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className='mt-8 border-t border-gray-700 py-6 text-center text-sm text-white/75 sm:mt-12 sm:py-8'>
          Copyright 2025 All rights Reserved. RC Brown Homes.
        </div>
      </div>
    </footer>
  );
}
