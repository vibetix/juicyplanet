import { useEffect, useRef, useState } from "react";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const videos = [
  "/videos/orange-drop.mp4",
  "/videos/sobolo-fly.mp4",
  "/videos/orange-turn.mp4",
];

const HeroSection = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    setFadeIn(false); // fade out
    setTimeout(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
      setFadeIn(true); // fade in new video
    }, 300);
  };

useEffect(() => {
  const video = videoRef.current;
  if (video) {
    const handlePlay = async () => {
      try {
        video.load(); // load the new source
        await video.play(); // wait for play to complete
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Video playback failed:", err);
        }
      }
    };

    handlePlay();
  }
}, [currentVideo]);


  return (
    <section className="relative min-h-[80vh] bg-gradient-to-br from-juicy-yellow/10 to-juicy-green/10 overflow-hidden">
      {/* Background bubbles */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-juicy-yellow rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-juicy-green rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-juicy-red rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-raleway font-bold text-gray-800 leading-tight">
              Squeeze the Day with <span className="text-juicy-green">Juicy</span>{" "}
              <span className="text-juicy-yellow">Planet</span> 🍊
            </h1>
            <p className="text-xl text-gray-600 font-quicksand leading-relaxed">
              Fresh, handcrafted juices made with love by our chef. Cold-pressed goodness
              with no additives, just pure nature in every sip.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-juicy-yellow hover:bg-juicy-yellow-light text-gray-800 font-quicksand font-semibold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link to="/shop">
                Shop Fresh Juices 🥤
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-juicy-green text-juicy-green hover:bg-juicy-green hover:text-white font-quicksand font-semibold text-lg px-8 py-6 rounded-full transition-all duration-300">
              <Link to="/shop">
                Learn Our Story
              </Link>
              </Button>
            </div>

            <div className="flex items-center space-x-6 pt-4">
              {["Cold-Pressed", "No Additives", "Chef-Crafted"].map((text, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-juicy-green rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-sm font-quicksand text-gray-600">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Video */}
          <div className="relative">
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <video
                key={currentVideo}
                ref={videoRef}
                autoPlay
                muted
                playsInline
                loop={false}
                onEnded={handleVideoEnd}
                className={`w-full h-96 object-cover rounded-2xl transition-opacity duration-300 ${fadeIn ? "opacity-100" : "opacity-0"}`}
              >
                <source src={videos[currentVideo]} type="video/mp4" />
              </video>


              <div className="absolute -top-4 -right-4 bg-juicy-red text-white px-4 py-2 rounded-full font-quicksand font-bold shadow-lg animate-bounce-gentle">
                Fresh Daily!
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-juicy-yellow rounded-full opacity-80 animate-float" style={{ animationDelay: "0.5s" }}></div>
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-juicy-green rounded-full opacity-80 animate-float" style={{ animationDelay: "1.5s" }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
