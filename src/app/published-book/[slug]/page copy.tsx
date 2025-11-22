'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart, FiExternalLink, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { booksAPI } from '@/services/api';
import { useCart } from '@/app/components/CartContext';

const ProductPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const resolvedParams = React.use(params);
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { addToCart } = useCart();

  React.useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        setError(null);
        
        const identifier = resolvedParams.slug;
        console.log('Published book page - identifier:', identifier);
        
        if (!identifier || identifier === 'undefined') {
          console.log('Published book page - invalid identifier, setting not found');
          setNotFound(true);
          return;
        }
        
        // Try to get by ID first since you mentioned the backend works with ID
        console.log('Published book page - trying to get book by ID:', identifier);
        const response = await booksAPI.getById(identifier);
        console.log('Published book page - API response:', response);
        
        if (response.data && response.data.success && response.data.data) {
          console.log('Published book page - setting product data:', response.data.data);
          setProduct(response.data.data);
        } else if (response.data && response.data.data) {
          // Handle case where response doesn't have success property
          console.log('Published book page - setting product data (no success property):', response.data.data);
          setProduct(response.data.data);
        } else {
          console.log('Published book page - no data found, trying by slug');
          // If ID fails, try by slug
          const slugResponse = await booksAPI.getBySlug(identifier);
          if (slugResponse.data && slugResponse.data.success && slugResponse.data.data) {
            console.log('Published book page - setting product data from slug:', slugResponse.data.data);
            setProduct(slugResponse.data.data);
          } else if (slugResponse.data && slugResponse.data.data) {
            console.log('Published book page - setting product data from slug (no success property):', slugResponse.data.data);
            setProduct(slugResponse.data.data);
          } else {
            console.log('Published book page - both ID and slug failed');
            setNotFound(true);
          }
        }
      } catch (error: any) {
        console.error('Published book page - API error:', error);
        setError(error.response?.data?.message || 'Failed to load book details');
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [resolvedParams.slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart({ ...product, id: product._id });
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-light)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--saffron-primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--text-secondary)]">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-light)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Book not found</h1>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <p className="text-[var(--text-secondary)] mb-4">The book you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/published-book"
            className="inline-flex items-center text-[var(--saffron-primary)] hover:text-[var(--saffron-dark)]"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background-light)] py-12">
      <div className="container mx-auto px-4">
        <Link 
          href="/published-book"
          className="inline-flex items-center text-[var(--saffron-primary)] hover:text-[var(--saffron-dark)] mb-8"
        >
          <FiArrowLeft className="w-5 h-5 mr-2" />
          Back to Books
        </Link>

        {/* Debug section - remove this in production */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(product, null, 2)}
            </pre>
          </div>
        )} */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Left Column - Product Preview */}
            <div className="space-y-6">
              <div className="aspect-[3/4] bg-gradient-to-br from-[var(--saffron-light)] to-[var(--saffron-primary)] rounded-xl flex items-center justify-center overflow-hidden">
                {product.coverImage ? (
                  <img 
                    src={product.coverImage} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xl font-medium">Book Cover</span>
                )}
              </div>
              
              <div className="bg-[var(--saffron-light)] p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Product Details</h3>
                <div className="space-y-3">
                  <p><span className="font-medium">Author:</span> {product.author}</p>
                  <p><span className="font-medium">Genre:</span> {product.genre}</p>
                  <p><span className="font-medium">Published:</span> {product.year}</p>
                  <p><span className="font-medium">Format:</span> {product.format}</p>
                  <p><span className="font-medium">Language:</span> {product.language}</p>
                  <p><span className="font-medium">Stock:</span> {product.stock} units</p>
                  {product.pages && <p><span className="font-medium">Pages:</span> {product.pages}</p>}
                  {product.isbn && <p><span className="font-medium">ISBN:</span> {product.isbn}</p>}
                  {product.dimensions && <p><span className="font-medium">Dimensions:</span> {product.dimensions}</p>}
                  {product.weight && <p><span className="font-medium">Weight:</span> {product.weight}</p>}
                </div>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">{product.title}</h1>
                <div className="flex items-center mb-6">
                  <div className="flex text-[var(--saffron-primary)]">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-5 h-5 ${i < (product.rating || 5) ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-[var(--text-secondary)]">({product.reviews || 0} reviews)</span>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {product.fullDescription || product.description}
                </p>
              </div>

              <div className="bg-[var(--saffron-light)] p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Purchase Options</h3>
                <div className="space-y-4">
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-[var(--saffron-primary)] hover:bg-[var(--saffron-dark)] text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <FiShoppingCart className="w-5 h-5" />
                    Add to Cart - ${product.price}
                  </button>
                  {product.amazonLink && (
                    <a
                      href={product.amazonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-white border-2 border-[var(--saffron-primary)] text-[var(--saffron-primary)] hover:bg-[var(--saffron-light)] py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <FiExternalLink className="w-5 h-5" />
                      Buy on Amazon
                    </a>
                  )}
                </div>
              </div>

              <div className="bg-[var(--saffron-light)] p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Book Preview</h3>
                <p className="text-[var(--text-secondary)] mb-4">Read the first chapter and get a taste of the book's style and content.</p>
                <button className="text-[var(--saffron-primary)] hover:text-[var(--saffron-dark)] font-medium">
                  Read Preview →
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductPage; 