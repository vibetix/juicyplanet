import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

type Testimonial = {
  id: number;
  name: string;
  text: string;
  image: string;
  rating: number;
};

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: "Safety Technologies",
      text: "Their spring rolls taste amazing! I accidentally left them out of the fridge for a whole day, yet they were still in great condition. The flavor truly stands out—there’s definitely a difference.The taste, the difference indeed. Thank you!",
      image: 'https://randomuser.me/api/portraits/men/44.jpg',
      rating: 5,
    },
    {
      id: 2,
      name: "Mr Benjamin",
      text: "Their juice is so irresistible that my family never lets me enjoy it alone. Even when I sneak a glass in secret, they somehow find out and come for theirs—leaving me with nothing! The taste is refreshingly different and always worth sharing… though I wish I didn’t have to!",
      image: 'https://randomuser.me/api/portraits/men/36.jpg',
      rating: 5,
    },
    {
      id: 3,
      name: "Doctor Samuel",
      text: "I really enjoy Asana Juice! The taste is refreshingly unique, and every sip leaves me wanting more. It’s simply that good",
      image: 'https://randomuser.me/api/portraits/men/65.jpg',
      rating: 5,
    },
    {
      id: 4,
      name: "Emily",
      text: "Your juice is 100% on point—no one does it fresher! Keep juicing and keep shining.",
      image: 'https://randomuser.me/api/portraits/women/65.jpg',
      rating: 5,
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const renderStars = (rating: number) => (
    <div className="flex justify-center mb-4">
      {[...Array(rating)].map((_, i) => (
        <span key={i} className="text-juicy-yellow text-xl">⭐</span>
      ))}
    </div>
  );

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-raleway font-bold text-gray-800 mb-4">
            What Our <span className="text-juicy-red">Happy Sippers</span> Say
          </h2>
          <p className="text-xl text-gray-600 font-quicksand max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our juice-loving community has to say!
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-gradient-to-br from-juicy-yellow/10 to-juicy-green/10 border-0 shadow-2xl">
            <CardContent className="p-12 text-center">
              {renderStars(testimonials[currentTestimonial].rating)}

              <blockquote className="text-2xl font-quicksand text-gray-700 leading-relaxed mb-8 italic">
                "{testimonials[currentTestimonial].text}"
              </blockquote>

              <div className="flex items-center justify-center space-x-4">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div className="text-left">
                  <div className="font-raleway font-bold text-lg text-gray-800">
                    {testimonials[currentTestimonial].name}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center space-x-3 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial 
                  ? 'bg-juicy-green scale-125' 
                  : 'bg-gray-300 hover:bg-juicy-green/50'
              }`}
            />
          ))}
        </div>

        {/* Card Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-20">
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative bg-white border border-juicy-yellow/20 shadow-md rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute -top-8">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>
              <div className="mt-12">
                {renderStars(t.rating)}
                <p className="text-gray-600 font-quicksand italic mb-4 leading-relaxed">
                  “{t.text}”
                </p>
                <span className="font-semibold text-gray-900 font-raleway text-lg block">
                  {t.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
      <div className="text-center">
        <Button
          variant="outline"
          size="lg"
          className="border-juicy-green text-juicy-green hover:bg-juicy-green hover:text-white font-quicksand font-semibold px-8 py-4 rounded-full transition-all duration-300"
        >
          <Link to="/testimonials">View All Testimonials →</Link>
        </Button>
      </div>
    </section>
  );
};

export default Testimonials;
