'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiImage, FiVideo, FiPlay } from 'react-icons/fi';

const GalleryPage = () => {
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

  const galleryItems = [
    {
      type: 'image',
      title: 'Book Launch Event',
      description: 'The grand launch of "Me No Pause, Me Play"',
      src: '/images/gallery/book-launch.jpg',
      alt: 'Book Launch Event'
    },
    {
      type: 'video',
      title: 'Author Interview',
      description: 'Exclusive interview with Manoj Kumar Sharma',
      src: '/videos/author-interview.mp4',
      thumbnail: '/images/gallery/interview-thumb.jpg',
      alt: 'Author Interview'
    },
    {
      type: 'image',
      title: 'Novel Reading',
      description: 'Live Novel reading session',
      src: '/images/gallery/author-reading.jpg',
      alt: 'Author Reading'
    },
    {
      type: 'video',
      title: 'Book Signing',
      description: 'Meet and greet with readers',
      src: '/videos/book-signing.mp4',
      thumbnail: '/images/gallery/signing-thumb.jpg',
      alt: 'Book Signing'
    },
    {
      type: 'image',
      title: 'Literary Festival',
      description: 'Participation in International Literary Festival',
      src: '/images/gallery/literary-fest.jpg',
      alt: 'Literary Festival'
    },
    {
      type: 'image',
      title: 'Award Ceremony',
      description: 'Receiving the prestigious literary award',
      src: '/images/gallery/award-ceremony.jpg',
      alt: 'Award Ceremony'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-r from-[var(--saffron-primary)] to-[var(--saffron-dark)] text-white py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Gallery
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-[var(--saffron-light)] max-w-2xl mx-auto"
          >
            Explore the moments that define Manoj Kumar Sharma's journey as an author and producer
          </motion.p>
        </div>
      </motion.section>

      {/* Gallery Grid */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {galleryItems.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="group relative overflow-hidden rounded-xl shadow-lg bg-white"
              >
                <div className="aspect-video relative overflow-hidden">
                  {item.type === 'image' ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback to placeholder if image doesn't exist
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextElementSibling) {
                            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--saffron-light)] to-[var(--saffron-primary)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <FiImage className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={item.thumbnail || item.src}
                        alt={item.alt}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback to placeholder if image doesn't exist
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextElementSibling) {
                            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--saffron-light)] to-[var(--saffron-primary)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <FiPlay className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/50 rounded-full p-3">
                          <FiPlay className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Fallback placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--saffron-light)] to-[var(--saffron-primary)] flex items-center justify-center hidden">
                    {item.type === 'image' ? (
                      <FiImage className="w-16 h-16 text-white" />
                    ) : (
                      <FiVideo className="w-16 h-16 text-white" />
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--saffron-primary)] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-[var(--text-secondary)]">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default GalleryPage;