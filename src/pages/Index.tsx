
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturedJuices from '@/components/FeaturedJuices';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-[60px]">
        <HeroSection />
        <FeaturedJuices />
        <WhyChooseUs />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
