"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/src/components/ui/carousel";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { useMediaQuery } from "@/src/lib/hooks/use-mobile";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  rating: number;
  content: string;
  avatar: string;
}

export default function TestimonialCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "John Smith",
      role: "Business Owner",
      rating: 5,
      content:
        "Exceptional service from start to finish! The team was professional, knowledgeable, and made the entire buying process smooth and stress-free. Highly recommend for anyone looking to invest in real estate.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "John Smith",
      role: "Investor",
      rating: 5,
      content:
        "Exceptional service from start to finish! The team was professional, knowledgeable, and made the entire buying process smooth and stress-free. Highly recommend for anyone looking to invest in real estate.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      name: "John Smith",
      role: "Business Analyst",
      rating: 5,
      content:
        "Exceptional service from start to finish! The team was professional, knowledgeable, and made the entire buying process smooth and stress-free. Highly recommend for anyone looking to invest in real estate.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 4,
      name: "Sarah Johnson",
      role: "Real Estate Agent",
      rating: 5,
      content:
        "Exceptional service from start to finish! The team was professional, knowledgeable, and made the entire buying process smooth and stress-free. Highly recommend for anyone looking to invest in real estate.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 5,
      name: "Michael Brown",
      role: "Property Developer",
      rating: 5,
      content:
        "Exceptional service from start to finish! The team was professional, knowledgeable, and made the entire buying process smooth and stress-free. Highly recommend for anyone looking to invest in real estate.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 6,
      name: "Emily Davis",
      role: "First-time Buyer",
      rating: 5,
      content:
        "Exceptional service from start to finish! The team was professional, knowledgeable, and made the entire buying process smooth and stress-free. Highly recommend for anyone looking to invest in real estate.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 7,
      name: "Robert Wilson",
      role: "Commercial Investor",
      rating: 5,
      content:
        "Exceptional service from start to finish! The team was professional, knowledgeable, and made the entire buying process smooth and stress-free. Highly recommend for anyone looking to invest in real estate.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ];

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const getItemBasis = () => {
    if (isMobile) return "basis-full";
    if (isTablet) return "md:basis-1/2";
    return "lg:basis-1/3";
  };

  return (
    <div className='mx-auto w-full max-w-7xl px-4 py-8 sm:py-12'>
      <div className='mb-8 flex flex-col items-center justify-between gap-4 sm:mb-12 sm:flex-row sm:gap-0'>
        <h2 className='text-center text-2xl font-semibold text-primary sm:text-left sm:text-3xl lg:text-4xl'>
          What Investors are Saying
        </h2>
        <div className='flex gap-2'>
          <Button
            onClick={() => api?.scrollPrev()}
            variant='outline'
            size='icon'
            className='h-10 w-10 rounded-full border-2 border-primary hover:bg-primary hover:text-white xl:h-12 xl:w-12'
          >
            <ChevronLeft className='size-4 xl:size-5' />
            <span className='sr-only'>Previous slide</span>
          </Button>
          <Button
            onClick={() => api?.scrollNext()}
            variant='outline'
            size='icon'
            className='h-10 w-10 rounded-full border-2 border-primary hover:bg-primary hover:text-white xl:h-12 xl:w-12'
          >
            <ChevronRight className='size-4 xl:size-5' />
            <span className='sr-only'>Next slide</span>
          </Button>
        </div>
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className='w-full'
      >
        <CarouselContent className='-ml-2 sm:-ml-4'>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className={`pl-2 sm:pl-4 ${getItemBasis()}`}>
              <div className='flex h-full flex-col rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-6'>
                <div className='mb-3 flex space-x-1 text-[#FF9811]'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className='size-3 fill-current sm:size-4' />
                  ))}
                </div>
                <p className='mb-4 flex-grow text-sm text-text-muted sm:mb-6'>{testimonial.content}</p>
                <div className='flex items-center gap-3'>
                  <div className='relative h-10 w-10 overflow-hidden rounded-full sm:h-12 sm:w-12'>
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div>
                    <h4 className='text-sm font-semibold text-text-muted'>{testimonial.name}</h4>
                    <p className='text-xs font-light text-[#55A2F0] sm:text-sm'>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className='mt-4 flex justify-center gap-2 sm:mt-6'>
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              current === index ? "w-4 bg-primary sm:w-6" : "bg-text-muted/40"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
