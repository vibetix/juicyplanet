import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
   {
      name: "Safety Technologies",
      location: "Madina",
      text: "Their spring rolls taste amazing! I accidentally left them out of the fridge for a whole day, yet they were still in great condition. The flavor truly stands out—there’s definitely a difference.The taste, the difference indeed. Thank you!",
      rating: 5,
      image: "👷‍♂️"
    },
    {
      name: "Mr Benjamin",
      location: "Tema",
      text: "Their juice is so irresistible that my family never lets me enjoy it alone. Even when I sneak a glass in secret, they somehow find out and come for theirs—leaving me with nothing! The taste is refreshingly different and always worth sharing… though I wish I didn’t have to!",
      rating: 5,
      image: "🤵"
    },
    {
      name: "Doctor Samuel",
      location: "Ashaiman",
      text: "I really enjoy Asana Juice! The taste is refreshingly unique, and every sip leaves me wanting more. It’s simply that good",
      rating: 5,
      image: "👨‍⚕️"
    },
    {
      name: "Emily",
      location: "Accra",
      text: "Your juice is 100% on point—no one does it fresher! Keep juicing and keep shining.",
      rating: 5,
      image: "😍"
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
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-juicy-green text-juicy-green hover:bg-juicy-green hover:text-white font-quicksand font-semibold px-8 py-4 rounded-full transition-all duration-300"
          >
            <a href="/testimonials">View All Testimonials →</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
