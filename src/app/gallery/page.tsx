'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiImage, FiVideo, FiPlay } from 'react-icons/fi';
import Lightbox from '../components/Lightbox';

const GalleryPage = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Generate 33 gallery items dynamically
  const galleryItems = Array.from({ length: 33 }, (_, i) => ({
    type: 'image' as const,
    title: `Gallery Image ${i + 1}`,
    description: '',
    src: `/images/gallery/gallery-${i + 1}.jpeg`, // Assuming logic from rename script
    alt: `Gallery Image ${i + 1}`
  }));

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
                className="group relative overflow-hidden rounded-xl shadow-lg bg-white cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-video relative overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        // Try .jpg if .jpeg fails - primitive fallback logic
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src.endsWith('.jpeg')) {
                          target.src = target.src.replace('.jpeg', '.jpg');
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <FiImage className="text-white w-10 h-10 drop-shadow-lg" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <Lightbox
        images={galleryItems}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setCurrentImageIndex((prev) => (prev + 1) % galleryItems.length)}
        onPrev={() => setCurrentImageIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length)}
      />
    </div>
  );
};

export default GalleryPage;