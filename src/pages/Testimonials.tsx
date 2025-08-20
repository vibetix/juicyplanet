// src/pages/Testimonials.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Trash2, Upload } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  message: string;
  rating: number;
  image?: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      message:
        "This platform completely changed how I manage my events. Super easy to use and very reliable!",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: 2,
      name: "Michael Lee",
      message: "Great experience! My event ticket sales doubled in a week.",
      rating: 4,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    message: "",
    rating: 0,
    image: null as File | null,
    imagePreview: "",
  });

  const handleAddTestimonial = () => {
    if (!form.name || !form.message || !form.rating) return;
    const newTestimonial: Testimonial = {
      id: Date.now(),
      name: form.name,
      message: form.message,
      rating: form.rating,
      image: form.imagePreview || undefined,
    };
    setTestimonials([...testimonials, newTestimonial]);
    setForm({ name: "", message: "", rating: 0, image: null, imagePreview: "" });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm({
        ...form,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const removeImage = () => {
    setForm({ ...form, image: null, imagePreview: "" });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Testimonials</h1>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {testimonials.map((t) => (
          <Card key={t.id} className="shadow-lg rounded-2xl">
            <CardContent className="flex flex-col items-center p-6 space-y-4">
              <img
                src={t.image || "https://via.placeholder.com/100"}
                alt={t.name}
                className="w-20 h-20 rounded-full object-cover shadow-md"
              />
              <h3 className="font-semibold text-lg">{t.name}</h3>
              <p className="text-gray-600 text-center">{t.message}</p>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Testimonial Form */}
      <Card className="p-6 shadow-xl rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Add Your Testimonial</h2>
        <div className="space-y-4">
          <Input
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Textarea
            placeholder="Write your experience..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />

          {/* Rating */}
          <div className="flex items-center gap-2">
            <span className="text-gray-700">Your Rating:</span>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                onClick={() => setForm({ ...form, rating: i + 1 })}
                className={`w-6 h-6 cursor-pointer transition ${
                  i < form.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 hover:text-yellow-400"
                }`}
              />
            ))}
          </div>

          {/* Image Upload Section */}
          <div className="flex items-center gap-4">
            {form.imagePreview ? (
              <div className="flex items-center gap-3">
                <img
                  src={form.imagePreview}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover shadow-md"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Remove
                </Button>
              </div>
            ) : (
              <label className="cursor-pointer flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition">
                <Upload className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <Button className="w-full" onClick={handleAddTestimonial}>
            Submit Testimonial
          </Button>
        </div>
      </Card>
    </div>
  );
}
