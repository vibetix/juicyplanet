// src/pages/404.tsx
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center space-y-6 pt-[120px]">
        {/* Icon */}
        <AlertTriangle className="w-24 h-24 text-juicy-yellow mb-4 animate-bounce" />

        {/* Message */}
        <h1 className="text-5xl font-raleway font-bold text-gray-800">Oops! Page Not Found</h1>
        <p className="text-gray-600 font-quicksand max-w-xl mx-auto text-base">
          The page you’re looking for doesn’t exist or may have been moved. But don’t worry — let’s get you back on track.
        </p>

        {/* Button */}
        <Button
          onClick={() => navigate('/')}
          className="bg-juicy-yellow text-gray-800 font-quicksand font-medium rounded-full shadow-md hover:shadow-lg px-8"
        >
          Go Back Home
        </Button>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
