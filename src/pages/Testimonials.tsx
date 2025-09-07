import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Upload, Trash2 } from 'lucide-react';
import axios from 'axios';
import supabase  from "@/lib/supabaseClient";

interface Testimonial {
  id: number;
  name: string;
  text: string;
  image?: string;
  rating: number;
  user_id?: string;
}

const TestimonialPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [form, setForm] = useState({
    name: '',
    text: '',
    rating: 5,
    imageFile: null as File | null,
    imagePreview: '',
  });
  const [loading, setLoading] = useState(false);

  // Fetch testimonials from backend
  const fetchTestimonials = async () => {
    try {
      const res = await axios.get('https://juicy-backend.onrender.com/user/testimonials');
      setTestimonials(res.data);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setForm({ ...form, imageFile: file, imagePreview: URL.createObjectURL(file) });
    }
  };

  const removeImage = () => setForm({ ...form, imageFile: null, imagePreview: '' });
  // Helper function to filter explicit words
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!form.name || !form.text) return;
  setLoading(true);

  try {
    const user = supabase.auth.user();
    if (!user) throw new Error('User not authenticated');
    const token = (await supabase.auth.getSession()).data.session?.access_token;

    let imageUrl = 'https://via.placeholder.com/150';
    if (form.imageFile) {
      const formData = new FormData();
      formData.append('image', form.imageFile);

      const imgRes = await axios.post(
        'https://juicy-backend.onrender.com/user/upload-image', // You need to make this endpoint
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      imageUrl = imgRes.data.url; // Ensure backend returns the image URL
    }

    const res = await axios.post(
      'https://juicy-backend.onrender.com/user/testimonial',
      {
        name: form.name,
        text: profanityFilter(form.text),
        rating: form.rating,
        image: imageUrl,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTestimonials([res.data, ...testimonials]);
    setForm({ name: '', text: '', rating: 5, imageFile: null, imagePreview: '' });
  } catch (err) {
    console.error('Error adding testimonial:', err);
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const user = supabase.auth.user();
      if (!user) throw new Error('User not authenticated');

      const token = (await supabase.auth.getSession()).data.session?.access_token;

      await axios.delete(`https://juicy-backend.onrender.com/user/delete-testimonial/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTestimonials(testimonials.filter((t) => t.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || 'Cannot delete testimonial: only the owner can delete it.');
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex justify-center gap-1 mb-3">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${i < rating ? 'fill-juicy-yellow text-juicy-yellow' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-juicy-yellow/10 via-white to-juicy-green/5">
      <Header />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 container mx-auto pt-[80px]">
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
                  src={t.image || 'https://via.placeholder.com/150'}
                  alt={t.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>
              <div className="mt-12">
                {renderStars(t.rating)}
                <p className="text-gray-600 font-quicksand italic mb-4 leading-relaxed">“{t.text}”</p>
                <span className="font-semibold text-gray-900 font-raleway text-lg block">{t.name}</span>

                {/* Delete button only for owner */}
                {t.user_id === supabase.auth.user()?.id && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-3 flex items-center gap-2"
                    onClick={() => handleDelete(t.id)}
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                )}
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

            {/* Image Upload */}
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
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
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
                      i < form.rating ? 'fill-juicy-yellow text-juicy-yellow' : 'text-gray-300 hover:text-juicy-yellow'
                    }`}
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-juicy-yellow to-juicy-green text-gray-900 hover:opacity-90 transition-all font-quicksand font-semibold rounded-full shadow-md hover:shadow-lg py-3 text-lg"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Add Testimonial'}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TestimonialPage;
