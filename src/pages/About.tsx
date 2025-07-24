  // src/pages/About.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 container mx-auto max-w-5xl space-y-12 pt-[80px]">
        {/* About Us */}
        <section className="space-y-4 text-center">
          <h1 className="text-4xl font-raleway font-bold text-gray-800">About Us</h1>
          <p className="text-gray-600 font-quicksand max-w-2xl mx-auto leading-relaxed">
            Welcome to <span className="text-juicy-green font-medium">Juicy Planet</span> — your one-stop shop for healthy, tasty, and refreshing drinks.  
            Our mission is to inspire a healthier lifestyle by crafting beverages from the freshest fruits and ingredients.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 border border-juicy-yellow/20 shadow-sm rounded-lg space-y-2 text-center">
            <h2 className="text-2xl font-raleway font-semibold text-juicy-green">Our Mission</h2>
            <p className="text-gray-600 font-quicksand leading-relaxed">
              To create and deliver the freshest, most nutritious, and most delicious juices that help you live your best life.
            </p>
          </Card>
          <Card className="p-6 border border-juicy-yellow/20 shadow-sm rounded-lg space-y-2 text-center">
            <h2 className="text-2xl font-raleway font-semibold text-juicy-green">Our Vision</h2>
            <p className="text-gray-600 font-quicksand leading-relaxed">
              To become the leading juice brand recognized for quality, taste, and health benefits that everyone loves.
            </p>
          </Card>
        </section>

        {/* Meet the Team */}
        <section className="space-y-6 text-center">
          <h2 className="text-2xl font-raleway font-bold text-gray-800">Meet the Team</h2>
          <p className="text-gray-600 font-quicksand max-w-2xl mx-auto leading-relaxed">
            Our passionate team of nutritionists, chefs, and customer support specialists work together to craft every delicious drink and ensure the best experience for you.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-10 mt-6">
            <Card className="p-4 border border-juicy-yellow/20 shadow-sm rounded-lg">
              <img
                src="/images/Boss.jpg"
                alt="Jane Doe"
                className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
              />
              <h3 className="text-lg font-raleway font-semibold text-gray-800">Eunice Adjei</h3>
              <p className="text-sm text-juicy-green font-quicksand">Founder & CEO</p>
            </Card>
            <Card className="p-4 border border-juicy-yellow/20 shadow-sm rounded-lg">
              <img
                src="/images/friend.jpg"
                alt="John Smith"
                className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
              />
              <h3 className="text-lg font-raleway font-semibold text-gray-800">Miss Mercy</h3>
              <p className="text-sm text-juicy-green font-quicksand">Team Member</p>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
