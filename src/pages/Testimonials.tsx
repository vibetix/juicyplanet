import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Upload, Trash2 } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  text: string;
  image?: string;
  rating: number;
}

const TestimonialPage = () => {
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

  const [form, setForm] = useState({
    name: '',
    text: '',
    rating: 5,
    imageFile: null as File | null,
    imagePreview: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.text) return;

    const newTestimonial: Testimonial = {
      id: testimonials.length + 1,
      name: form.name,
      text: form.text,
      image: form.imagePreview || 'https://via.placeholder.com/150',
      rating: form.rating,
    };

    setTestimonials([...testimonials, newTestimonial]);
    setForm({ name: '', text: '', rating: 5, imageFile: null, imagePreview: '' });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm({
        ...form,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const removeImage = () => {
    setForm({ ...form, imageFile: null, imagePreview: '' });
  };

  const renderStars = (rating: number) => (
    <div className="flex justify-center gap-1 mb-3">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < rating ? 'fill-juicy-yellow text-juicy-yellow' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-juicy-yellow/10 via-white to-juicy-green/5">
      <Header />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 container mx-auto pt-[80px]">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-raleway font-extrabold text-gray-800 mb-4">
            Hear From Our Happy Customers
          </h1>
          <p className="text-lg text-gray-600 font-quicksand max-w-2xl mx-auto">
            We value every voice. Here’s what people are saying about their experience.
          </p>
        </div>

        {/* Testimonials Grid */}
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

        {/* Add Testimonial Form */}
        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-lg border border-juicy-yellow/30">
          <h2 className="text-2xl font-raleway font-bold text-gray-800 mb-6 text-center">
            Share Your Experience ✨
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-juicy-yellow font-quicksand"
              required
            />
            <textarea
              placeholder="Your Testimonial"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-juicy-yellow font-quicksand"
              rows={4}
              required
            />

            {/* Image Upload Section */}
            <div>
              {form.imagePreview ? (
                <div className="flex items-center gap-4">
                  <img
                    src={form.imagePreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border border-gray-200 shadow"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer flex items-center gap-2 bg-gray-100 px-4 py-3 rounded-xl border border-gray-300 shadow hover:bg-gray-200 transition">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-quicksand">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            {/* Rating Selector */}
            <div className="flex items-center gap-2">
              <span className="font-quicksand text-gray-700">Your Rating:</span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    onClick={() => setForm({ ...form, rating: i + 1 })}
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      i < form.rating
                        ? 'fill-juicy-yellow text-juicy-yellow'
                        : 'text-gray-300 hover:text-juicy-yellow'
                    }`}
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-juicy-yellow to-juicy-green text-gray-900 hover:opacity-90 transition-all font-quicksand font-semibold rounded-full shadow-md hover:shadow-lg py-3 text-lg"
            >
              Add Testimonial
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TestimonialPage;
