'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiCalendar, FiShoppingCart } from 'react-icons/fi';
import Link from 'next/link';
import { booksAPI } from '@/services/api';
import { useCart } from '@/app/components/CartContext';
import Image from 'next/image';


const PublishedBookPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);

        // 👉 Fetch from your live API first
        const response = await booksAPI.getAll();

        if (response?.data?.data?.length > 0) {
          console.log("📡 Loaded from API");
          setBooks(response.data.data);
        } else {
          throw new Error("API returned no usable data");
        }

      } catch (apiError) {
        console.error("❌ API failed:", apiError);
        // No fallback - only use backend data
      }

      setLoading(false);
    };

    loadBooks();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, book: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...book, id: book._id || book.slug });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-light)]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-[var(--saffron-primary)] rounded-full mx-auto"></div>
          <p className="mt-4">Loading books...</p>
        </div>
      </div>
    );
  }

  if (!books.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">No books available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background-light)] py-12">
      <div className="container mx-auto px-4">

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center text-[var(--text-primary)] mb-16"
        >
          Published Books
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 100 }}
            transition={{ duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mt-4"
          />
        </motion.h1>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
        >
          {books.map((book, index) => {
            const identifier = book.slug || book._id || index;
            return (
              <Link href={`/published-book/${identifier}`} key={identifier}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-xl shadow-lg cursor-pointer overflow-hidden group"
                >
                  <div className="h-64 w-full relative">
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover rounded-sm transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold group-hover:text-[var(--saffron-primary)] transition">
                      {book.title}
                    </h3>

                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {book.description}
                    </p>

                    <div className="flex justify-between items-center mt-6">
                      <span className="flex items-center text-[var(--saffron-primary)]">
                        <FiCalendar className="mr-2" />
                        {book.year}
                      </span>

                      <button
                        onClick={(e) => handleAddToCart(e, book)}
                        className="btn-primary flex items-center gap-2"
                      >
                        <FiShoppingCart />
                        ₹{book.price}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>

      </div>
    </div>
  );
};

export default PublishedBookPage;
