'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { FiArrowRight, FiArrowLeft, FiVideo, FiImage } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/navigation';

const Movies = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const moviesItems = [
    {
      type: 'image',
      title: 'Me No Pause, Me Play',
      description: "A story about womanhood, strength, and empowerment." ,
      src: '/images/movies/mepausemovie.jpeg',
      thumbnail: '/images/movies/mepausemovie.jpeg',
      alt: 'Book Launch Event',
    },
    // {
    //   type: 'video',
    //   title: 'Author Interview',
    //   description: 'Receiving the prestigious literary award',
    //   src: '/videos/author-interview.mp4',
    //   thumbnail: '/images/movies/interstellar.jpg',
    //   alt: 'Author Interview',
    // },
    // {
    //   type: 'image',
    //   title: 'Poetry Reading',
    //   description: 'Receiving the prestigious literary award',
    //   src: '/images/movies/interstellar.jpg',
    //   alt: 'Poetry Reading',
    // },
    // {
    //   type: 'video',
    //   title: 'Book Signing',
    //   description: 'Receiving the prestigious literary award',
    //   src: '/videos/book-signing.mp4',
    //   thumbnail: '/images/movies/interstellar.jpg',
    //   alt: 'Book Signing',
    // },
    // {
    //   type: 'image',
    //   title: 'Literary Festival',
    //   description: 'Receiving the prestigious literary award',
    //   src: '/images/movies/interstellar.jpg',
    //   alt: 'Literary Festival',
    // },
    // {
    //   type: 'image',
    //   title: 'Award Ceremony',
    //   description: 'Receiving the prestigious literary award',
    //   src: '/images/movies/interstellar.jpg',
    //   alt: 'Award Ceremony',
    // },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-20 bg-[var(--background-light)] relative"
    >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-center text-[var(--text-primary)] mb-16 relative"
        >
          Movies
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            transition={{ duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8 mt-10"
          />
        </motion.h2>

        {/* Swiper Carousel */}
        <motion.div variants={containerVariants} className="relative max-w-7xl mx-auto mb-12">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1.2}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2.5 },
              1024: { slidesPerView: 3.5 },
            }}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="!pb-10"
          >
            {moviesItems.map((item, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group relative overflow-hidden rounded-xl shadow-lg bg-white"
                >
                  <div className="aspect-video relative">
                    {item.thumbnail || item.src ? (
                      <Image
                        src={item.thumbnail || item.src}
                        alt={item.alt}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--saffron-light)] to-[var(--saffron-primary)] flex items-center justify-center">
                        {item.type === 'image' ? (
                          <FiImage className="w-16 h-16 text-white" />
                        ) : (
                          <FiVideo className="w-16 h-16 text-white" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--saffron-primary)] transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-[var(--text-secondary)]">{item.description}</p>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Arrows */}
          <div className="swiper-button-prev-custom absolute -left-2 top-1/2 transform -translate-y-1/2 z-10 bg-[var(--saffron-primary)] hover:bg-[var(--saffron-dark)] text-white p-2 rounded-full shadow-md transition-all duration-300 cursor-pointer">
            <FiArrowLeft className="w-4 h-4" />
          </div>
          <div className="swiper-button-next-custom absolute -right-2 top-1/2 transform -translate-y-1/2 z-10 bg-[var(--saffron-primary)] hover:bg-[var(--saffron-dark)] text-white p-2 rounded-full shadow-md transition-all duration-300 cursor-pointer">
            <FiArrowRight className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Explore Button */}
        <motion.div variants={itemVariants} className="text-center mt-8">
          <Link href="/about">
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
    </motion.section>
  );
};

export default Movies;
