// src/pages/Contact.tsx
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ContactInfo {
  address: string;
  phone: string[];
  email: string;
}

const Contact = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: "Tema, Golf-City, Ghana",
    phone: ["+233 55 253 3635", "+233 26 860 3767"],
    email: "hello@juicyplanet.com",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const data = {
      name: form.get("name"),
      email: form.get("email"),
      message: form.get("message"),
    };

    try {
      const res = await fetch(`https://juicy-backend.onrender.com/user/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(result.message || "Message sent successfully!");
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(result.error || "Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await fetch(`https://juicy-backend.onrender.com/user/contact-info`);
        const data = await res.json();
        setContactInfo(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load contact info.");
      }
    };

    fetchContactInfo();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 container mx-auto max-w-5xl space-y-12 pt-[80px]">
        {/* Heading */}
        <section className="text-center space-y-2">
          <h1 className="text-4xl font-raleway font-bold text-gray-800">Contact Us</h1>
          <p className="text-gray-600 font-quicksand max-w-2xl mx-auto">
            Have questions or want to collaborate? Reach out to us and we’ll get back to you as soon as we can.
          </p>
        </section>

        {/* Contact Info */}
        <section className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 border border-juicy-yellow/20 shadow-sm rounded-lg text-center space-y-2">
            <h2 className="text-xl font-raleway font-semibold text-juicy-green">Address</h2>
            <p className="text-gray-600 font-quicksand">{contactInfo.address}</p>
          </Card>
          <Card className="p-6 border border-juicy-yellow/20 shadow-sm rounded-lg text-center space-y-2">
            <h2 className="text-xl font-raleway font-semibold text-juicy-green">Phone</h2>
            {contactInfo.phone.map((p, i) => (
              <p key={i} className="text-gray-600 font-quicksand">{p}</p>
            ))}
          </Card>
          <Card className="p-6 border border-juicy-yellow/20 shadow-sm rounded-lg text-center space-y-2">
            <h2 className="text-xl font-raleway font-semibold text-juicy-green">Email</h2>
            <p className="text-gray-600 font-quicksand">{contactInfo.email}</p>
          </Card>
        </section>

        {/* Contact Form */}
        <section className="space-y-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-raleway font-bold text-center text-gray-800">Send Us a Message</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input name="name" placeholder="Your Name" required className="font-quicksand w-full" />
            <Input name="email" type="email" placeholder="Your Email" required className="font-quicksand w-full" />
            <textarea
              name="message"
              placeholder="Your Message"
              required
              className="w-full border border-juicy-yellow/40 rounded-md p-3 font-quicksand text-sm text-gray-700 min-h-[120px]"
            ></textarea>
            <Button
              type="submit"
              className="w-full bg-juicy-yellow hover:bg-juicy-yellow-light text-gray-800 font-quicksand font-medium rounded-full shadow-md"
            >
              Send Message
            </Button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
