'use client';
import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { FiBookOpen, FiCalendar, FiShoppingCart } from 'react-icons/fi';
import Link from 'next/link';
import { booksAPI } from '@/services/api';
import { useCart } from '../CartContext';

interface Book {
  _id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  price: number;
  rating: number;
  reviews: number;
  year: number;
  genre: string;
  format: string;
  coverImage: string;
  amazonLink?: string;
}

const Products = () => {
  const [products, setProducts] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await booksAPI.getAll();
        if (response.data?.data) {
          // Show first 4 books as featured products
          setProducts(response.data.data.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-20 bg-[var(--background-light)]"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-center text-[var(--text-primary)] mb-16 relative"
        >
          Products
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            transition={{ duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8 mt-10"
          />
        </motion.h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {products.map((product) => (
              <Link href={`/published-book/${product.slug}`} key={product._id || product.slug}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                  className="product-card group bg-white cursor-pointer"
                >
                <div className="product-image">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-br from-[var(--saffron-light)] to-[var(--saffron-primary)] flex items-center justify-center"
                  >
                    <motion.div
                      whileHover={{ 
                        scale: 1.2,
                        rotate: 5,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <FiBookOpen className="w-16 h-16 text-white" />
                    </motion.div>
                  </motion.div>
                </div>
                <div className="product-content">
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3 group-hover:text-[var(--saffron-primary)] transition-colors duration-300">
                    {product.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center mb-4">
                    <div className="flex text-[var(--saffron-primary)]">
                      {[...Array(Math.floor(product.rating || 0))].map((_, i) => (
                        <FiBookOpen key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-[var(--text-secondary)] ml-2">
                      ({product.reviews || 0} reviews)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center text-[var(--saffron-primary)]"
                    >
                      <FiCalendar className="w-5 h-5 mr-2" />
                      <span className="font-medium">{product.year}</span>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary flex items-center space-x-2"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart({ ...product, id: product._id || product.slug });
                      }}
                    >
                      <FiShoppingCart className="w-5 h-5" />
                      <span>${product.price}</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
        )}
      </div>
    </motion.section>
  );
};

export default Products; 