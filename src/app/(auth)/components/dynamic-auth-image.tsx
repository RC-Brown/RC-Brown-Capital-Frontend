"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function DynamicAuthImage() {
  const pathname = usePathname();

  // Determine image source based on the current path
  const getImageSrc = (path: string) => {
    if (path.includes("register-investor")) {
      return "/images/register-investor.png";
    } else if (path.includes("register-sponsor")) {
      return "/images/register-sponsor.png";
    } else if (path.includes("login")) {
      return "/images/login.png";
    }
    // Default fallback
    return "/images/register-investor.png";
  };

  // Get alt text based on the current path
  const getAltText = (path: string) => {
    if (path.includes("register-investor")) {
      return "Modern residential building with wood and glass facade";
    } else if (path.includes("register-sponsor")) {
      return "Real estate investment and sponsorship opportunities";
    } else if (path.includes("login")) {
      return "Welcome back to your investment platform";
    }
    return "Modern residential building with wood and glass facade";
  };

  const imageSrc = getImageSrc(pathname);
  const altText = getAltText(pathname);

  return (
    <div className='relative h-full w-full'>
      {pathname.includes("register-sponsor") && (
        <div className='absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent sm:h-32' />
      )}
      {pathname.includes("register-sponsor") && (
        <div className='absolute bottom-8 left-8 right-8 z-10 text-white sm:bottom-11 sm:left-11 sm:right-11'>
          <p className='mb-5 text-3xl'>Let’s create your perfect portfolio.</p>
          <p className='text-sm'>
            Showcase your real estate projects to a network of verified investors sign up as a sponsor for free and
            start raising capital today.
          </p>
        </div>
      )}
      <Image src={imageSrc} alt={altText} width={604} height={865} className='h-full w-full object-cover' priority />
    </div>
  );
}
