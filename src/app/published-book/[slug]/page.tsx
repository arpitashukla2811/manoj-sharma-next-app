'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart, FiExternalLink, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { booksAPI } from '../../services/api';

const ProductPage = ({ params }: { params: { slug: string } }) => {
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    setNotFound(false);
    booksAPI.getBySlug(params.slug)
      .then(res => {
        if (res.data && res.data.success && res.data.data) {
          setProduct(res.data.data);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-amber-800">Loading...</h1>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-amber-800">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background-light)] py-12">
      <div className="container mx-auto px-4">
        <Link 
          href="/products"
          className="inline-flex items-center text-amber-800 hover:text-amber-900 mb-8"
        >
          <FiArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Left Column - Product Preview */}
            <div className="space-y-6">
              <div className="aspect-[3/4] bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                <span className="text-amber-800 text-xl font-medium">Book Cover</span>
              </div>
              
              <div className="bg-amber-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-amber-800 mb-4">Product Details</h3>
                <div className="space-y-3">
                  <p><span className="font-medium">Author:</span> {product.author}</p>
                  <p><span className="font-medium">Genre:</span> {product.genre}</p>
                  <p><span className="font-medium">Published:</span> {product.year}</p>
                  <p><span className="font-medium">Format:</span> {product.format}</p>
                  <p><span className="font-medium">Pages:</span> {product.pages}</p>
                  <p><span className="font-medium">Language:</span> {product.language}</p>
                  <p><span className="font-medium">ISBN:</span> {product.isbn}</p>
                  <p><span className="font-medium">Dimensions:</span> {product.dimensions}</p>
                  <p><span className="font-medium">Weight:</span> {product.weight}</p>
                  <p><span className="font-medium">Stock:</span> {product.stock} units</p>
                </div>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-amber-800 mb-4">{product.title}</h1>
                <div className="flex items-center mb-6">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-5 h-5 ${i < product.rating ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">({product.reviews} reviews)</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{product.fullDescription}</p>
              </div>

              <div className="bg-amber-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-amber-800 mb-4">Purchase Options</h3>
                <div className="space-y-4">
                  <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <FiShoppingCart className="w-5 h-5" />
                    Add to Cart - {product.price}
                  </button>
                  {product.amazonLink && (
                    <a
                      href={product.amazonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-white border-2 border-amber-600 text-amber-600 hover:bg-amber-50 py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <FiExternalLink className="w-5 h-5" />
                      Buy on Amazon
                    </a>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-amber-800 mb-4">Book Preview</h3>
                <p className="text-gray-700 mb-4">Read the first chapter and get a taste of the book's style and content.</p>
                <button className="text-amber-600 hover:text-amber-700 font-medium">
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