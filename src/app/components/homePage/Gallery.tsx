'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiImage, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import Lightbox from '../Lightbox';

const Gallery = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use the first 6 images for the homepage
  const galleryItems = Array.from({ length: 6 }, (_, i) => ({
    type: 'image' as const,
    title: `Gallery Image ${i + 1}`,
    description: '',
    src: `/images/gallery/gallery-${i + 1}.jpeg`,
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
          Gallery
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            transition={{ duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8 mt-10"
          />
        </motion.h2>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12"
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
              <div className="aspect-video relative">
                <div className="relative w-full h-full">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      // Try .jpg if .jpeg fails
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
              {/* <div className="p-6">
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--saffron-primary)] transition-colors duration-300">
                  {item.title}
                </h3>
              </div> */}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="text-center"
        >
          <Link href="/gallery">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center space-x-2 px-8 py-4 text-lg"
            >
              <span>Explore More</span>
              <FiArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      <Lightbox
        images={galleryItems}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setCurrentImageIndex((prev) => (prev + 1) % galleryItems.length)}
        onPrev={() => setCurrentImageIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length)}
      />
    </motion.section>
  );
};

export default Gallery; 