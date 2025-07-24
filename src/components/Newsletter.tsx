
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Welcome to the Juicy Planet family! 🎉",
        description: "You'll be the first to know about new flavors and special offers.",
      });
      setEmail('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-20 bg-gradient-to-r from-juicy-red/10 via-juicy-yellow/10 to-juicy-green/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-juicy-red rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-juicy-yellow rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-raleway font-bold text-gray-800 mb-4">
              Stay <span className="text-juicy-red">Juicy</span> with Us!
            </h2>
            <p className="text-xl text-gray-600 font-quicksand leading-relaxed">
              Get the freshest updates on new juice flavors, seasonal specials, and wellness tips delivered straight to your inbox.
            </p>
          </div>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-full shadow-2xl">
              <Input
                type="email"
                placeholder="Enter your email for juicy updates..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border-0 bg-transparent text-lg font-quicksand placeholder:text-gray-400 focus-visible:ring-0"
                required
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-juicy-red hover:bg-juicy-red-light text-white font-quicksand font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {isLoading ? 'Joining...' : 'Join the Juice Club 🧃'}
              </Button>
            </div>
          </form>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-juicy-green/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎁</span>
              </div>
              <div className="text-left">
                <div className="font-raleway font-semibold text-gray-800">Exclusive Offers</div>
                <div className="text-sm text-gray-600 font-quicksand">Special discounts just for subscribers</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-juicy-yellow/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🆕</span>
              </div>
              <div className="text-left">
                <div className="font-raleway font-semibold text-gray-800">New Flavors First</div>
                <div className="text-sm text-gray-600 font-quicksand">Be first to try our latest creations</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-juicy-red/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <div className="text-left">
                <div className="font-raleway font-semibold text-gray-800">Wellness Tips</div>
                <div className="text-sm text-gray-600 font-quicksand">Expert nutrition and health advice</div>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 font-quicksand">
              We respect your privacy. Unsubscribe at any time. 🔒
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
