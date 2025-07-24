import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star } from '@/components/icons';

const parsePrice = (value: string | number | null | undefined): string => {
  if (typeof value === 'number') return `¢${value.toFixed(2)}`;
  if (typeof value === 'string') {
    const num = parseFloat(value.replace(/[^\d.]/g, ''));
    return isNaN(num) ? '¢0.00' : `¢${num.toFixed(2)}`;
  }
  return '¢0.00';
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:4000/user/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const juices = products.filter(product => product.category === 'drinks');
  const pastries = products.filter(
    product => product.category === 'bakery' || product.category === 'snacks'
  );
  const featuredProducts = products.filter(product => product.is_featured);
  const categories = [...new Set(products.map(product => product.category))];

  const renderProducts = (productList) => {
    return productList.map((product) => (
      <Link key={product.id} to={`/product/${product.slug || product.id}`}>
        <Card className="group h-full flex flex-col hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
          <CardContent className="p-0 flex flex-col h-full">
            <div className="relative overflow-hidden">
              <img
                src={product.images?.[0] || '/placeholder.png'}
                alt={product.name}
                className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              <div className="absolute top-3 left-3 flex flex-col items-start gap-2">
                {product.is_featured && (
                  <Badge className="bg-juicy-green text-white">Featured</Badge>
                )}
                {product.original_price && (
                  <Badge variant="outline" className="bg-white line-through text-gray-500">
                    {parsePrice(product.original_price)}
                  </Badge>
                )}
              </div>

              <Badge className="absolute top-3 right-3 bg-juicy-yellow text-gray-900 font-bold">
                {parsePrice(product.price)}
              </Badge>
            </div>

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
                      ({product.review_count || 0})
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
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="py-12 md:py-20 bg-white pt-[60px]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-juicy-green">Delicious</span> Offerings
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Handcrafted with love using the finest ingredients.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <Button
              variant={activeTab === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveTab('all')}
              className="rounded-full"
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeTab === category ? 'default' : 'outline'}
                onClick={() => setActiveTab(category)}
                className="rounded-full capitalize"
              >
                {category}
              </Button>
            ))}
            <Button
              variant={activeTab === 'featured' ? 'default' : 'outline'}
              onClick={() => setActiveTab('featured')}
              className="rounded-full"
            >
              Featured
            </Button>
          </div>

          {(activeTab === 'all' || activeTab === 'featured') && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-4 h-4 bg-juicy-green rounded-full mr-3"></span>
                Featured Collection
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderProducts(featuredProducts)}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'drinks') && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-4 h-4 bg-juicy-green rounded-full mr-3"></span>
                Fresh Juice Collection
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderProducts(juices)}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'bakery' || activeTab === 'snacks') && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-4 h-4 bg-juicy-green rounded-full mr-3"></span>
                Fresh Bites Collection
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderProducts(pastries)}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;
