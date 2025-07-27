import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  Heart,
  HeartFilled,
  ShoppingCart,
  ChevronLeft,
} from '@/components/icons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import LoadingSpinner from "@/components/LoadingSpinner"; 

const parsePrice = (priceValue: string | number | null | undefined): number => {
  if (typeof priceValue === 'number') return priceValue;
  if (typeof priceValue !== 'string') return 0;

  const parsed = parseFloat(priceValue.replace(/[^\d.]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const { addItem } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://juicy-backend.onrender.com/user/product/${slug}`);
        const data = await res.json();
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        toast.error('Failed to load product.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) return <LoadingSpinner />;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-gray-500">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button onClick={() => navigate('/shop')} className="mt-4">
          Back to Shop
        </Button>
      </div>
    );
  }

  const price = selectedSize ? parsePrice(selectedSize.price) : parsePrice(product.price);
  const originalPrice = selectedSize?.original_price
    ? parsePrice(selectedSize.original_price)
    : product.original_price
    ? parsePrice(product.original_price)
    : null;

  const handleWishlistToggle = () => {
    const wishlistItem = {
      id: product.id,
      slug: product.slug,
      name: `${product.name} - ${selectedSize?.label || 'Default'}`,
      price,
      image: product.images?.[0],
      rating: product.rating,
    };

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(wishlistItem);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: `${product.name} - ${selectedSize?.label || 'Default'}`,
        price,
        image: product.images?.[0],
        size: selectedSize?.label || null,
      },
      quantity
    );

    toast.success(`${quantity} ${product.name} added to cart`, {
      action: {
        label: 'View Cart',
        onClick: () => navigate('/cart'),
      },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="py-8 md:py-12 pt-[60px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to shop
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
                <img
                  src={product.images?.[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              </div>

              <Carousel className="w-full">
                <CarouselContent>
                  {product.images?.map((img: string, idx: number) => (
                    <CarouselItem key={idx} className="basis-1/3 md:basis-1/4">
                      <button
                        onClick={() => setSelectedImage(idx)}
                        className={`aspect-square overflow-hidden rounded-lg cursor-pointer transition-all ${
                          selectedImage === idx
                            ? 'ring-2 ring-yellow-400 scale-105'
                            : 'hover:opacity-80'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} view ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {product.name}
                  </h1>
                  {product.category && (
                    <Badge variant="outline" className="mt-2 capitalize">
                      {product.category}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col items-end">
                  <div className="text-2xl font-bold text-gray-900">
                    ¢{price.toFixed(2)}
                    {originalPrice && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        ¢{originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {product.stock !== undefined && (
                    <span className="text-sm text-gray-500 mt-1">
                      {product.stock > 10
                        ? 'In stock'
                        : product.stock > 0
                        ? `Only ${product.stock} left`
                        : 'Out of stock'}
                    </span>
                  )}
                </div>
              </div>

              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : i < product.rating
                            ? 'text-yellow-400 fill-current opacity-50'
                            : 'text-gray-300 fill-current'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.review_count || 0} reviews)
                  </span>
                </div>
              )}

              <!-- Remaining part of the component remains unchanged -->
