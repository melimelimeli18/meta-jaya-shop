import HeroSection from "@/src/app/sections/user/home/HeroSection";
import AboutSection from "@/src/app/sections/user/home/AboutSection";
import FeaturedProductSection from "@/src/app/sections/user/home/FeaturedProductSection";
import UsedProductSection from "@/src/app/sections/user/home/UsedProductSection";
import TestimonialSection from "@/src/app/sections/user/home/TestimonialSection";
import CallToActionSection from "@/src/app/sections/user/home/CallToActionSection";

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
