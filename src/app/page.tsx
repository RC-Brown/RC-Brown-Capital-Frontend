import Navbar from "@/components/molecules/navbar";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrendingUp, Building2, Users, ArrowRight } from "lucide-react";
import FeaturedListings from "@/components/molecules/featured-listings";
import TestimonialCarousel from "@/components/molecules/testimonial-carousel";
import Footer from "@/components/molecules/footer";

export default function Home() {
  return (
    <div className='bg-background-secondary min-h-screen'>
      <Navbar />
      {/* Hero Section */}
      <section className='relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[82vh]'>
        <div className='absolute inset-0'>
          <Image src='/images/hero-img.png' alt='Business meeting' fill className='object-cover' priority />
        </div>

        <div className='container relative mx-auto px-4 pt-16 sm:px-6 sm:pt-20 lg:px-20 lg:pt-28'>
          <div className='max-w-xs sm:max-w-md lg:max-w-lg'>
            <h1 className='mb-6 text-2xl font-bold leading-tight tracking-wide text-white sm:mb-8 sm:text-3xl lg:text-5xl lg:leading-[1.5]'>
              Gateway to high <br className='hidden sm:block' /> yield Real Estate Investments.
            </h1>

            <div className='mb-12 flex flex-col gap-3 rounded-md bg-white bg-opacity-10 bg-clip-padding p-3 backdrop-blur-2xl backdrop-filter sm:mb-16 sm:flex-row sm:gap-4 sm:p-4'>
              <Input
                placeholder='Email'
                className='h-10 border-0 bg-white/90 text-base placeholder:text-black sm:h-11 sm:text-lg'
              />
              <Button className='h-10 px-4 text-sm font-semibold sm:h-11 sm:px-6'>Join RC Brown</Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className='absolute -bottom-[280px] left-1/2 grid w-[90%] max-w-6xl -translate-x-1/2 gap-4 sm:-bottom-[300px] sm:gap-6 md:-bottom-[325px] md:grid-cols-3 md:gap-8'>
            <Card className='group cursor-pointer rounded-[10px] border-none bg-white p-4 shadow-lg transition-all duration-300 ease-in-out hover:bg-primary hover:text-white sm:p-5'>
              <CardContent className='pt-8 sm:pt-14'>
                <div className='flex flex-col items-center space-y-4 text-center sm:flex-row sm:items-start sm:space-x-6 sm:space-y-0 sm:text-left'>
                  <Image
                    src='/icons/invest.svg'
                    alt='Invest Smarter'
                    width={40}
                    height={40}
                    className='flex-shrink-0 sm:h-[50px] sm:w-[50px]'
                  />
                  <div>
                    <h3 className='text-lg font-normal leading-[1.4] sm:text-xl lg:text-2xl lg:leading-[1.5]'>
                      Invest Smarter, Live Better. Your Path to Passive Income Starts Here.
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='group cursor-pointer rounded-[10px] border-none bg-primary p-4 text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-white hover:text-black sm:p-5'>
              <CardContent className='pt-8 sm:pt-14'>
                <div className='flex flex-col items-center space-y-4 text-center sm:flex-row sm:items-start sm:space-x-6 sm:space-y-0 sm:text-left'>
                  <Image
                    src='/icons/buildings.svg'
                    alt='Invest Smarter'
                    width={40}
                    height={40}
                    className='flex-shrink-0 sm:h-[50px] sm:w-[50px]'
                  />
                  <div>
                    <h3 className='text-lg font-normal leading-[1.4] sm:text-xl lg:text-2xl lg:leading-[1.5]'>
                      Own a Piece of the Property Pie - Real Estate for Every Investor.
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='group cursor-pointer rounded-[10px] border-none bg-white p-4 shadow-lg transition-all duration-300 ease-in-out hover:bg-primary hover:text-white sm:p-5 md:col-span-1'>
              <CardContent className='pt-8 sm:pt-14'>
                <div className='flex flex-col items-center space-y-4 text-center sm:flex-row sm:items-start sm:space-x-6 sm:space-y-0 sm:text-left'>
                  <Image
                    src='/icons/invest-buildings.svg'
                    alt='Invest Smarter'
                    width={40}
                    height={40}
                    className='flex-shrink-0 sm:h-[50px] sm:w-[50px]'
                  />
                  <div>
                    <h3 className='text-lg font-normal leading-[1.4] sm:text-xl lg:text-2xl lg:leading-[1.5]'>
                      Diversify and Relax, Unwind from Stock Market Stress.
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className='mt-48 bg-white sm:mt-56 md:mt-64'>
        <div className='container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-16 lg:py-20'>
          <div className='grid items-center gap-8 lg:grid-cols-2 lg:gap-12'>
            <div className='order-2 lg:order-1'>
              <h2 className='mb-4 text-2xl font-semibold leading-[1.4] text-primary sm:mb-6 sm:text-3xl lg:text-[40px] lg:leading-[1.5]'>
                Streamlined investment made <br className='hidden sm:block' /> simple and effortless
              </h2>
              <p className='mb-4 text-sm leading-relaxed text-text-muted sm:mb-6 sm:text-base'>
                Whether you're a first-time investor or expanding a seasoned portfolio, our marketplace equips you with
                the tools, insights, and support needed to make smart, efficient investment decisions.
              </p>
              <p className='mb-6 text-sm leading-relaxed text-text-muted sm:mb-8 sm:text-base'>
                Our platform streamlines the process of discovering and evaluating direct investment opportunities.
                Browse a curated selection of commercial real estate projects, access detailed financial documents, join
                live webinars with developers, and submit investment offers—all from the comfort of your home.
              </p>
              <Button className='px-8 py-3 text-sm font-semibold sm:px-12 sm:py-4 lg:py-7'>Join RC Brown</Button>
            </div>
            <div className='relative order-1 lg:order-2'>
              <Image
                src='/images/streamlined-investment.png'
                alt='Investment professional'
                width={638}
                height={444}
                className='h-auto w-full rounded-[10px]'
              />
            </div>
          </div>
        </div>
      </section>

      <FeaturedListings />

      {/* About Us Section */}
      <section className='py-12 sm:py-16 lg:py-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-16'>
          <div className='grid items-center gap-8 lg:grid-cols-2 lg:gap-12'>
            <div className='relative order-2 lg:order-1'>
              <Image
                src='/images/about-section.png'
                alt='Team meeting'
                width={588}
                height={395}
                className='h-auto w-full rounded-lg'
              />
            </div>
            <div className='order-1 lg:order-2'>
              <h2 className='mb-4 text-2xl font-semibold text-primary sm:mb-6 sm:text-3xl lg:text-[40px]'>About us</h2>
              <p className='mb-4 text-sm leading-relaxed text-text-muted sm:mb-6 sm:text-base'>
                Welcome to RC Brown Homes, a leading multinational real estate investment company headquartered in the
                United States. With a dynamic and visionary approach, we have curated a diverse portfolio that exceeds
                $150,000,000 in value while funding an average of $10,000,000 transactions per month.
              </p>
              <p className='mb-6 text-sm leading-relaxed text-text-muted sm:mb-8 sm:text-base'>
                Our mission is to redefine the real estate landscape by creating exceptional residential and commercial
                properties that stand as testaments to innovation, quality, and sustainability.
              </p>
              <Button className='flex items-center gap-2 py-3 text-sm font-semibold has-[>svg]:px-5 sm:py-4 has-[>svg]:sm:px-7 lg:py-6 lg:text-base'>
                Read More <ArrowRight className='size-3 sm:size-4' />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className='relative py-12 text-white sm:py-16 lg:py-20'>
        <div className='absolute inset-0'>
          <Image src='/images/facts.png' alt='Real estate property' fill className='object-cover' />
          <div className='absolute inset-0 bg-gray-900/60' />
        </div>

        <div className='container relative mx-auto px-4 sm:px-6 lg:px-16'>
          <div className='grid gap-6 sm:gap-8 lg:grid-cols-3'>
            <div className='lg:col-span-1'>
              <h2 className='mb-4 text-2xl font-light sm:text-3xl lg:text-4xl'>
                SOME INTERESTING <br />
                <span className='text-2xl font-semibold sm:text-3xl lg:text-4xl'>FACTS</span>
              </h2>
            </div>
            <div className='lg:col-span-2'>
              <p className='text-sm font-light sm:text-base'>
                RC Brown capital, USA has achieved a platinum institutional status in the American real estate sector,
                boasting of access to over $100,000,000 in investable dollars on an annualized basis.
              </p>
              <div className='mt-8 grid gap-6 text-center sm:mt-12 sm:grid-cols-3 sm:gap-8 lg:mt-16'>
                <div className=''>
                  <div className='mb-1 text-4xl font-bold sm:text-5xl lg:text-6xl'>100+</div>
                  <div className='text-sm font-light sm:text-base'>Deals Funded</div>
                </div>
                <div className=''>
                  <div className='mb-1 text-4xl font-bold sm:text-5xl lg:text-6xl'>$150M</div>
                  <div className='text-sm font-light sm:text-base'>Million Invested</div>
                </div>
                <div className=''>
                  <div className='mb-1 text-4xl font-bold sm:text-5xl lg:text-6xl'>200+</div>
                  <div className='text-sm font-light sm:text-base'>Realized Deals</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Insights Section */}
      <section className='bg-white py-12 sm:py-16 lg:py-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-16'>
          <div className='grid items-center gap-8 lg:grid-cols-2 lg:gap-12'>
            <div className='order-2 lg:order-1'>
              <h2 className='mb-4 text-2xl font-semibold text-primary sm:mb-6 sm:text-3xl lg:text-4xl'>
                Quick Insights
              </h2>
              <p className='mb-6 text-sm leading-relaxed text-text-muted sm:mb-8 sm:text-base lg:max-w-[80%]'>
                Access real-time data, market trends, and personalized investment. Consider properties with given
                certifications, as they may offer long-term value and appeal to environmentally conscious tenants.
              </p>
              <Button className='flex items-center gap-2 text-sm font-light has-[>svg]:pr-4 sm:text-base has-[>svg]:sm:pr-5'>
                Learn More <ArrowRight className='size-3 sm:size-4' />
              </Button>
            </div>
            <div className='relative order-1 lg:order-2'>
              <Image
                src='/images/quick-insights.png'
                alt='Modern house illustration'
                width={655}
                height={468}
                className='mx-auto h-auto w-full'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Partners */}
      <section className='bg-white py-12 sm:py-16'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-16'>
          <div className='rounded-[20px] border-b-2 border-black bg-gradient-to-b from-white from-10% via-[#f5f5f5] via-45% to-[#f5f5f5] px-4 py-8 sm:rounded-[30px] sm:px-8 sm:py-12'>
            <h2 className='mb-8 text-center text-2xl font-semibold text-primary sm:mb-12 sm:text-3xl lg:text-4xl'>
              A Selection of Our Institutional Partners
            </h2>

            <div className='grid grid-cols-2 items-center gap-4 sm:gap-8 md:grid-cols-4 lg:grid-cols-6'>
              {/* Partner logos - using placeholder images */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className='flex aspect-[2/1] items-center justify-center rounded-md bg-white p-2'>
                  <Image
                    src={`/images/partner-logo${i + 1}.png`}
                    alt={`Partner ${i + 1}`}
                    width={120}
                    height={60}
                    className='h-auto max-h-full w-auto max-w-full object-contain'
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className='bg-white py-12 sm:py-16 lg:py-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-16'>
          <TestimonialCarousel />
        </div>
      </section>

      <section className='bg-white pb-12 sm:pb-16 lg:pb-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-16'>
          <div className='flex flex-col overflow-hidden rounded-2xl bg-[#2A2A2A] sm:rounded-3xl md:flex-row'>
            <div className='flex flex-col justify-center px-6 py-8 md:w-1/2 md:px-8 lg:px-12'>
              <h2 className='mb-4 text-xl font-semibold text-white sm:mb-6 sm:text-2xl md:text-3xl lg:max-w-[80%] lg:text-4xl lg:leading-[1.6]'>
                Sign up with RC Brown Capital today & unlock premium real estate opportunities.
              </h2>
              <Button
                className='w-fit border-2 border-white bg-white/10 px-8 py-3 text-base font-medium text-white sm:px-10 sm:py-4 lg:px-12 lg:py-6 lg:text-lg'
                variant='outline'
              >
                Join RC BROWN
              </Button>
            </div>
            <div className='h-64 md:h-auto md:w-1/2'>
              <Image
                src='/images/join-img.png'
                alt='RC Brown Capital team working'
                width={615}
                height={410}
                className='h-full w-full object-cover'
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
