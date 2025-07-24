'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiCalendar, FiShoppingCart } from 'react-icons/fi';
import Link from 'next/link';
import { booksAPI } from '../services/api';

const PublishedBookPage = () => {
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

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await booksAPI.getAll();
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        setBooks(data);
        if (!Array.isArray(response.data.data)) {
          console.error('Books API did not return an array:', response.data.data);
        }
      } catch (error) {
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-light)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--saffron-primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--text-secondary)]">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-light)]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background-light)] py-12">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center text-[var(--text-primary)] mb-16 relative"
        >
          Published Books
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8 mt-10"
          />
        </motion.h1>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
        >
          {(books || []).map((book) => (
            <Link href={`/published-book/${book.slug}`} key={book._id}>
              <motion.div
                variants={itemVariants}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="book-card group bg-white cursor-pointer rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative h-64">
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
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3 group-hover:text-[var(--saffron-primary)] transition-colors duration-300">
                    {book.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4 line-clamp-2">
                    {book.description}
                  </p>
                  <div className="flex items-center mb-4">
                    <div className="flex text-[var(--saffron-primary)]">
                      {[...Array(Math.round(book.rating || 5))].map((_, i) => (
                        <FiBookOpen key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-[var(--text-secondary)] ml-2">
                      ({book.reviews || 0} reviews)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center text-[var(--saffron-primary)]"
                    >
                      <FiCalendar className="w-5 h-5 mr-2" />
                      <span className="font-medium">{book.year}</span>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary flex items-center space-x-2"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Add to cart functionality here
                      }}
                    >
                      <FiShoppingCart className="w-5 h-5" />
                      <span>${book.price}</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PublishedBookPage; 