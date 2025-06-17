"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedListings() {
  const autoplay = useRef(Autoplay({ delay: 2100, stopOnInteraction: false }));
  const lisitngs = [
    {
      name: "John Apartment",
      description:
        "123 Main St, Anytown, USA. This beautiful apartment features 2 spacious bedrooms, 2 modern bathrooms, a fully equipped kitchen, and a large living area with plenty of natural light. Located in the heart of Anytown, it offers easy access to shopping, dining, and public transportation. Perfect for families or professionals seeking comfort and convenience.",
      image: "/images/listing-1.png",
    },
    {
      name: "1004 North 10th Street",
      description:
        "1004 North 10th Street, Philadelphia, PA 19123. This stunning property offers 3 spacious bedrooms, 2.5 modern bathrooms, an open-concept kitchen with stainless steel appliances, and a sunlit living room perfect for entertaining. Enjoy hardwood floors throughout, a private backyard, and convenient access to local shops, restaurants, and public transportation. Ideal for families or professionals seeking a blend of comfort and city living.",
      image: "/images/listing-2.png",
    },
    {
      name: "RC Brown Apartment",
      description:
        "RC Brown Apartment, Philadelphia, PA 19123. This stunning property offers 3 spacious bedrooms, 2.5 modern bathrooms, an open-concept kitchen with stainless steel appliances, and a sunlit living room perfect for entertaining. Enjoy hardwood floors throughout, a private backyard, and convenient access to local shops, restaurants, and public transportation. Ideal for families or professionals seeking a blend of comfort and city living.",
      image: "/images/listing-3.png",
    },
    {
      name: "Avery Apartments",
      description:
        "Avery Apartments, Philadelphia, PA 19123. This stunning property offers 3 spacious bedrooms, 2.5 modern bathrooms, an open-concept kitchen with stainless steel appliances, and a sunlit living room perfect for entertaining. Enjoy hardwood floors throughout, a private backyard, and convenient access to local shops, restaurants, and public transportation. Ideal for families or professionals seeking a blend of comfort and city living.",
      image: "/images/listing-1.png",
    },
    {
      name: "Baker Apartments",
      description:
        "Baker Apartments, Philadelphia, PA 19123. This stunning property offers 3 spacious bedrooms, 2.5 modern bathrooms, an open-concept kitchen with stainless steel appliances, and a sunlit living room perfect for entertaining. Enjoy hardwood floors throughout, a private backyard, and convenient access to local shops, restaurants, and public transportation. Ideal for families or professionals seeking a blend of comfort and city living.",
      image: "/images/listing-3.png",
    },
    {
      name: "Cleveland Apartments",
      description:
        "Cleveland Apartments, Philadelphia, PA 19123. This stunning property offers 3 spacious bedrooms, 2.5 modern bathrooms, an open-concept kitchen with stainless steel appliances, and a sunlit living room perfect for entertaining. Enjoy hardwood floors throughout, a private backyard, and convenient access to local shops, restaurants, and public transportation. Ideal for families or professionals seeking a blend of comfort and city living.",
      image: "/images/listing-2.png",
    },
    {
      name: "Drexel Apartments",
      description:
        "Drexel Apartments, Philadelphia, PA 19123. This stunning property offers 3 spacious bedrooms, 2.5 modern bathrooms, an open-concept kitchen with stainless steel appliances, and a sunlit living room perfect for entertaining. Enjoy hardwood floors throughout, a private backyard, and convenient access to local shops, restaurants, and public transportation. Ideal for families or professionals seeking a blend of comfort and city living.",
      image: "/images/listing-1.png",
    },
  ];

  return (
    <section className='medium:min-h-screen medium:h-auto medium:max-h-fit relative h-[90vh] max-h-[650px]'>
      <div className='absolute inset-0'>
        <Image src='/images/featured-listing-bg.png' alt='Business meeting' fill className='object-cover' priority />
      </div>
      <div className='container relative mx-auto px-4 pb-6 pt-16 sm:px-6 sm:pb-9 sm:pt-20 lg:pt-28'>
        <div className='flex flex-col items-center text-center'>
          <Image src='/icons/video-play.svg' alt='Video play' width={56} height={56} className='mx-auto' />

          <h2 className='mt-2 text-2xl font-bold uppercase text-white sm:mt-3 sm:text-3xl lg:text-4xl'>
            The Marketplace for{" "}
            <span className='text-text-tertiary'>
              Smart <br /> Investments
            </span>
          </h2>

          <Button
            variant={"outline"}
            className='mx-auto mt-4 flex border-2 bg-white/10 px-10 py-3 text-xs font-bold text-white duration-75 hover:border-tertiary hover:bg-tertiary hover:text-primary sm:mt-5 sm:px-12 sm:py-4 lg:px-16 lg:py-6 lg:text-sm'
          >
            Invest Now
          </Button>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplay.current]}
          className='medium:lg:mt-32 mx-auto mt-16 w-full max-w-5xl sm:mt-24 lg:mt-24'
          onMouseEnter={() => autoplay.current.stop()}
          onMouseLeave={() => autoplay.current.play()}
        >
          <CarouselContent className='-ml-2'>
            {lisitngs.map((listing, index) => (
              <CarouselItem key={index} className='pl-1 md:basis-1/2 lg:basis-1/3'>
                <div className='p-1'>
                  <Card className='group relative h-48 cursor-pointer overflow-hidden rounded-[10px] border-2 border-[#D9D9D9] sm:h-56 lg:h-[190px] lg:border-4'>
                    <div className='absolute inset-0 -z-10'>
                      <Image src={listing.image} alt='Business meeting' fill className='object-cover' priority />
                    </div>
                    <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent sm:h-24' />
                    <CardContent className='relative flex h-full items-center justify-center p-4 sm:p-6'>
                      <span className='absolute bottom-3 left-3 z-10 text-lg font-semibold text-white transition-opacity duration-200 group-hover:opacity-0 sm:bottom-4 sm:left-4'>
                        {listing.name}
                      </span>
                      <span className='absolute bottom-3 left-3 right-3 z-10 line-clamp-2 text-sm font-light text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:bottom-4 sm:left-4 sm:right-4 sm:text-base'>
                        {listing.description}
                      </span>
                      <span className='absolute right-3 top-3 z-10 rounded-md bg-white/40 bg-opacity-50 bg-clip-padding px-2 py-1 text-sm font-medium uppercase text-white opacity-0 backdrop-blur-lg backdrop-filter transition-opacity duration-200 group-hover:opacity-100 sm:right-4 sm:top-4 sm:px-3 sm:py-2 sm:text-base lg:text-lg'>
                        Invest Now
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant='ghost'
            customIcon={
              <ChevronLeft className='box-content size-5 rounded-full bg-white/15 p-1.5 text-white sm:size-6 sm:p-2' />
            }
            className='left-2 xl:-left-10'
          />
          <CarouselNext
            variant='ghost'
            customIcon={
              <ChevronRight className='box-content size-5 rounded-full bg-white/15 p-1.5 text-white sm:size-6 sm:p-2' />
            }
            className='right-2 xl:-right-10'
          />
        </Carousel>
      </div>
    </section>
  );
}
