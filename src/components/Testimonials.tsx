
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Downtown",
      text: "Juicy Planet has transformed my morning routine! The Glow-Up Greens juice gives me energy that lasts all day. I love knowing exactly what's in my juice.",
      rating: 5,
      image: "👩‍💼"
    },
    {
      name: "Mike Rodriguez",
      location: "Midtown",
      text: "As a fitness enthusiast, I'm always looking for natural energy sources. The Sunrise Energy juice is perfect post-workout. Fresh, delicious, and no artificial stuff!",
      rating: 5,
      image: "🏃‍♂️"
    },
    {
      name: "Emma Wilson",
      location: "Uptown",
      text: "The Berry Bliss is my absolute favorite! It tastes like summer in a bottle. You can really taste the difference when it's made with love and quality ingredients.",
      rating: 5,
      image: "🌺"
    },
    {
      name: "David Chen",
      location: "Eastside",
      text: "I've been ordering weekly subscriptions for 6 months now. The variety keeps me excited, and the quality is consistently amazing. Highly recommend!",
      rating: 5,
      image: "👨‍💻"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
              {/* Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-juicy-yellow text-2xl">⭐</span>
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-2xl font-quicksand text-gray-700 leading-relaxed mb-8 italic">
                "{testimonials[currentTestimonial].text}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-juicy-green to-juicy-green-light rounded-full flex items-center justify-center text-2xl">
                  {testimonials[currentTestimonial].image}
                </div>
                <div className="text-left">
                  <div className="font-raleway font-bold text-lg text-gray-800">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="font-quicksand text-gray-600">
                    {testimonials[currentTestimonial].location}
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

        {/* All Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${
                index === currentTestimonial ? 'ring-2 ring-juicy-green' : ''
              }`}
              onClick={() => setCurrentTestimonial(index)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-juicy-yellow/20 to-juicy-green/20 rounded-full flex items-center justify-center text-lg">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-raleway font-semibold text-sm text-gray-800">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-gray-500 font-quicksand">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-juicy-yellow text-sm">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 font-quicksand text-sm leading-relaxed line-clamp-3">
                  {testimonial.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
