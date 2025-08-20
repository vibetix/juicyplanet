// src/pages/Contact.tsx
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Phone, Mail, MapPin } from "lucide-react";

interface ContactInfo {
  id: string;
  address: string;
  phone: string[]; // stored as array in DB
  email: string;
}

const Contact = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch("/api/user/contact-info");
        if (!res.ok) throw new Error("Failed to fetch contact info");
        const data = await res.json();
        setContactInfo(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="max-w-3xl w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          )}

          {error && (
            <p className="text-center text-red-500 font-medium">
              {error}
            </p>
          )}

          {!loading && !error && contactInfo.length === 0 && (
            <p className="text-center text-gray-500">No contact info found.</p>
          )}

          {!loading &&
            !error &&
            contactInfo.map((info) => (
              <Card key={info.id} className="mb-6 shadow-lg rounded-2xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <p className="text-lg">{info.address}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div className="flex flex-col">
                      {info.phone?.map((p, idx) => (
                        <span key={idx} className="text-lg">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-red-600" />
                    <p className="text-lg">{info.email}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
