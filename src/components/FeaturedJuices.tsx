import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star } from '@/components/icons';
import { Link } from 'react-router-dom';
import products from '@/data/products';

// Helper to safely format price
const formatPrice = (price: string | number | null | undefined): string => {
  if (typeof price === 'number') return `¢${price.toFixed(2)}`;
  if (typeof price === 'string') {
    const num = parseFloat(price.replace(/[^\d.]/g, ''));
    return isNaN(num) ? '¢0.00' : `¢${num.toFixed(2)}`;
  }
  return '¢0.00';
};

const FeaturedProducts = () => {
  const featured = products
    .filter((product) => product.isFeatured)
    .slice(0, 4); // Show only 4

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-raleway font-bold text-gray-800 mb-4">
            Featured <span className="text-juicy-green">Products</span>
          </h2>
          <p className="text-xl text-gray-600 font-quicksand max-w-2xl mx-auto">
            Curated just for you. Discover customer favorites and seasonal specials.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featured.map((product) => (
            <Link key={product.id} to={`/product/${product.slug || product.id}`}>
              <Card className="group h-full flex flex-col hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
                <CardContent className="p-0 flex flex-col h-full">
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.images?.[0] || '/placeholder.png'}
                      alt={product.name}
                      className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col items-start gap-2">
                      {product.isFeatured && (
                        <Badge className="bg-juicy-green text-white">Featured</Badge>
                      )}
                      {product.originalPrice && (
                        <Badge variant="outline" className="bg-white line-through text-gray-500">
                          {formatPrice(product.originalPrice)}
                        </Badge>
                      )}
                    </div>

                    <Badge className="absolute top-3 right-3 bg-juicy-yellow text-gray-900 font-bold">
                      {formatPrice(product.price)}
                    </Badge>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="mb-2">
                      {product.rating && (
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : i < product.rating
                                    ? 'text-yellow-400 fill-current opacity-50'
                                    : 'text-gray-300 fill-current'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-1">
                            ({product.reviewCount || 0})
                          </span>
                        </div>
                      )}

                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-juicy-green transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="mt-auto pt-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.benefits?.slice(0, 3).map((benefit, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-green-50 text-juicy-green hover:bg-green-100 text-xs"
                          >
                            {benefit}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-juicy-yellow hover:bg-juicy-yellow-dark text-gray-900 font-semibold rounded-lg"
                          size="sm"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                        <Button variant="outline" className="rounded-lg" size="sm">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-juicy-green text-juicy-green hover:bg-juicy-green hover:text-white font-quicksand font-semibold px-8 py-4 rounded-full transition-all duration-300"
          >
            <a href="/shop">View All Products →</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
