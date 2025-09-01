import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, CreditCard, Smartphone, Wallet } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-juicy-yellow to-juicy-yellow-light rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">🧃</span>
              </div>
              <h3 className="text-2xl font-raleway font-bold">
                Juicy <span className="text-juicy-green">Planet</span>
              </h3>
            </div>
            <p className="text-gray-400 font-quicksand leading-relaxed">
              Handcrafted juices made with love, passion, and the finest natural ingredients. Nourishing your body, one sip at a time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-juicy-yellow/20 rounded-full flex items-center justify-center hover:bg-juicy-yellow/30 transition-colors">
                <Facebook className="w-5 h-5 text-juicy-yellow" />
              </a>
              <a href="#" className="w-10 h-10 bg-juicy-green/20 rounded-full flex items-center justify-center hover:bg-juicy-green/30 transition-colors">
                <Instagram className="w-5 h-5 text-juicy-green" />
              </a>
              <a href="#" className="w-10 h-10 bg-juicy-red/20 rounded-full flex items-center justify-center hover:bg-juicy-red/30 transition-colors">
                <Twitter className="w-5 h-5 text-juicy-red" />
              </a>
              <a href="#" className="w-10 h-10 bg-juicy-red/20 rounded-full flex items-center justify-center hover:bg-juicy-green/30 transition-colors">
                <Tiktok className="w-5 h-5 text-juicy-red" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-raleway font-semibold mb-6 text-juicy-yellow">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/" className="text-gray-400 hover:text-juicy-green transition-colors font-quicksand">Home</a></li>
              <li><a href="/shop" className="text-gray-400 hover:text-juicy-green transition-colors font-quicksand">Shop Juices</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-juicy-green transition-colors font-quicksand">About Chef</a></li>
              <li><a href="/subscription" className="text-gray-400 hover:text-juicy-green transition-colors font-quicksand">Subscriptions</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-juicy-green transition-colors font-quicksand">Contact Us</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-raleway font-semibold mb-6 text-juicy-yellow">Customer Care</h4>
            <ul className="space-y-3">
              <li><a href="/faq" className="text-gray-400 hover:text-juicy-green transition-colors font-quicksand">FAQ</a></li>
              <li><a href="/delivery" className="text-gray-400 hover:text-juicy-green transition-colors font-quicksand">Delivery Info</a></li>
              <li><a href="/returns" className="text-gray-400 hover:text-juicy-green transition-colors font-quicksand">Returns</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-juicy-green transition-colors font-quicksand">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-juicy-green transition-colors font-quicksand">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-raleway font-semibold mb-6 text-juicy-yellow">Get In Touch</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-juicy-green/20 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-juicy-green" />
                </div>
                <span className="text-gray-400 font-quicksand">(+233) 26 860 3767 </span><br/>
                <span className="text-gray-400 font-quicksand">(+233) 55 253 3635 </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-juicy-green/20 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-juicy-green" />
                </div>
                <span className="text-gray-400 font-quicksand">hello@juicyplanet.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-juicy-green/20 rounded-full flex items-center justify-center mt-1">
                  <MapPin className="w-4 h-4 text-juicy-green" />
                </div>
                <span className="text-gray-400 font-quicksand">
                  Tema, Golf-City, Ghana
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 font-quicksand text-sm">
              © 2024 Juicy Planet. All rights reserved. Made with 💚 for your health.
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-400 font-quicksand">We accept:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-6 bg-juicy-yellow/20 rounded flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-juicy-yellow" />
                </div>
                <div className="w-8 h-6 bg-juicy-green/20 rounded flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-juicy-green" />
                </div>
                <div className="w-8 h-6 bg-juicy-red/20 rounded flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-juicy-red" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
