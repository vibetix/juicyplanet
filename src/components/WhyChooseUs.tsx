
import { Card, CardContent } from '@/components/ui/card';

const WhyChooseUs = () => {
  const features = [
    {
      icon: "❄️",
      title: "Cold-Pressed",
      description: "We use hydraulic presses to extract maximum nutrients without heat, preserving all the natural goodness.",
      color: "juicy-green"
    },
    {
      icon: "🌱",
      title: "No Additives",
      description: "Pure, natural ingredients only. No artificial colors, flavors, or preservatives. Just real fruit and vegetables.",
      color: "juicy-yellow"
    },
    {
      icon: "♻️",
      title: "Eco Bottles",
      description: "Sustainable glass bottles that are fully recyclable. We care about your health and our planet's future.",
      color: "juicy-red"
    },
    {
      icon: "👨‍🍳",
      title: "Chef-Crafted",
      description: "Every recipe is personally crafted by our chef with years of culinary expertise and passion for nutrition.",
      color: "juicy-green"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-juicy-yellow/5 to-juicy-green/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-raleway font-bold text-gray-800 mb-4">
            Why Choose <span className="text-juicy-green">Juicy Planet</span>?
          </h2>
          <p className="text-xl text-gray-600 font-quicksand max-w-3xl mx-auto">
            We're passionate about delivering the highest quality juices that nourish your body and delight your taste buds.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-8 text-center">
                {/* Icon */}
                <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-${feature.color}/20 to-${feature.color}/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-4xl">{feature.icon}</span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-raleway font-bold text-gray-800 mb-4 group-hover:text-juicy-green transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 font-quicksand leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-juicy-yellow/20">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-raleway font-bold text-juicy-green mb-2">1000+</div>
              <div className="text-gray-600 font-quicksand">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-raleway font-bold text-juicy-yellow mb-2">50+</div>
              <div className="text-gray-600 font-quicksand">Unique Recipes</div>
            </div>
            <div>
              <div className="text-4xl font-raleway font-bold text-juicy-red mb-2">100%</div>
              <div className="text-gray-600 font-quicksand">Natural Ingredients</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
