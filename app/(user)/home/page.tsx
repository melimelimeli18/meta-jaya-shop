import HeroSection from "@/app/sections/user/home/HeroSection";
import AboutSection from "@/app/sections/user/home/AboutSection";
import FeaturedProductSection from "@/app/sections/user/home/FeaturedProductSection";
import UsedProductSection from "@/app/sections/user/home/UsedProductSection";
import TestimonialSection from "@/app/sections/user/home/TestimonialSection";
import CallToActionSection from "@/app/sections/user/home/CallToActionSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturedProductSection />
      <UsedProductSection />
      <TestimonialSection />
      <CallToActionSection />
    </>
  );
}
