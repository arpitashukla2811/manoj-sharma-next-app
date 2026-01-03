"use client";
import React from "react";
import Image from "next/image";

import { motion } from "framer-motion";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* Section 1: About The Author */}
      <motion.section
        variants={itemVariants}
        className="bg-gradient-to-b from-amber-700 to-amber-800 text-white px-6 py-12 md:py-20"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-10 md:gap-16">
          <motion.div
            variants={itemVariants}
            className="flex-shrink-0 w-56 md:w-64"
          >
            <Image
              alt="Author portrait photo"
              src="/images/author/manoj.jpg"
              width={256}
              height={256}
              className="w-full h-auto object-cover rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="flex-1 max-w-4xl">
            <motion.h2
              variants={itemVariants}
              className="text-2xl md:text-3xl font-bold mb-3"
            >
              About The Author
            </motion.h2>
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 mb-6"
            >
              <div className="w-20 h-[3px] bg-amber-400 rounded" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
            </motion.div>
            <motion.p
              variants={itemVariants}
              className="uppercase  text-sm md:text-base font-semibold mb-4 leading-relaxed tracking-wide"
            >
              EX CORPORATE PROFESSIONAL, AUTHOR, PRODUCER.
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg leading-relaxed mb-4"
            >

            </motion.p>
            <motion.p
              variants={itemVariants}
              className="max-w-4xl mx-auto px-6 text-justify"
            >
              Manoj Kumar Sharma is a distinguished literary voice whose journey from corporate to authorship exemplifies the power of reinvention and creative expression. A retired engineer from renounced corporate company, Sharma brings a unique blend of analytical precision and emotional depth to his writing. His professional background, rooted in science and structure, contrasts beautifully with the fluidity and introspection of his literary work—creating a compelling duality that defines his style.
              Born and raised in Thane, Maharashtra, Manoj has always been deeply connected to the cultural and social rhythms of urban India. This connection is vividly reflected in his four published books: Mirrro, Me No Pause Me Play, Juuhhuu, and Hi God How Are You. Each title explores different facets of contemporary life, from existential musings and personal transformation to the quirks of modern society and the search for meaning in everyday experiences.
              His writing is known for its candid voice, philosophical undertones, and ability to provoke thought while remaining accessible to a wide audience. Manoj’s narratives often blur the line between reality and reflection, inviting readers to pause, question, and engage with the world around them in new ways. Whether delving into the complexities of identity or capturing the pulse of city life, his work resonates with authenticity and insight.
              As a well-regarded figure in contemporary Indian literature, Manoj Kumar Sharma continues to inspire readers with stories that are both deeply personal and universally relatable. His transition from a technical career to a literary one stands as a testament to the enduring power of curiosity, creativity, and the human spirit.

            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 2: Awards and Literary Works */}
      <motion.section
        variants={itemVariants}
        className="px-6 py-12 md:py-20 max-w-7xl mx-auto bg-white"
      >
        <div className="flex flex-col md:flex-row md:items-center md:gap-12">
          <motion.div
            variants={itemVariants}
            className="md:w-1/2 text-base md:text-lg leading-relaxed text-amber-900"
          >
            <motion.p variants={itemVariants} className="mb-6 font-bold">
              Manoj Kumar Sharma the beacon of socital...
            </motion.p>
            <motion.p variants={itemVariants} className="max-w-4xl mx-auto px-6 text-justify">
              Manoj Kumar Sharma stands as a towering figure in contemporary Indian literature, celebrated for his empathetic storytelling and socially conscious themes. With over 20 prestigious literary awards to his name—including Yatha Katha, Aghaaz, Aaweg, ICMDR, and the Azadi Ka Amrit Mahotsav series—Manoj has earned widespread acclaim for his masterworks Mirrro and Me No Pause Me Play. His writing delves into the nuanced realities of female life, global peace, and the human condition, addressing societal atrocities with sensitivity and insight. Known for a style that is both deeply engaging and easily accessible, Manoj connects with readers across generations. His personal life is a cornerstone of his creative inspiration: he has lovingly dedicated his books to his late mother, Mrs. Hemlata Sharma, and often shares thoughtful exchanges with his father. His wife and son serve as his most trusted critics, offering unwavering support and honest feedback that enrich his work. Featured in over 200 media outlets and newspapers, Manoj’s literary contributions have not only shaped public discourse but also uplifted his community, marking him as a beacon of cultural and intellectual excellence.

            </motion.p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="md:w-1/2 mt-8 md:mt-0 flex justify-center md:justify-end"
          >
            {/* import Image from 'next/image'; */}
            <Image
              alt="Award group photo"
              src="/images/author/Authorimg.jpg"
              width={500}
              height={325}
              className="shadow-xl rounded-lg max-w-full h-auto border-4 border-amber-500 hover:shadow-2xl transition-shadow duration-300"
            />
          </motion.div>
        </div>
        <motion.div variants={itemVariants} className="mt-16 text-amber-900">
          <motion.p
            variants={itemVariants}
            className="mb-6 text-lg md:text-xl font-semibold"
          >

          </motion.p>
          <motion.p
            variants={itemVariants}
            className="mb-4 text-lg md:text-xl font-semibold"
          >
            Achievement of Manoj Kumar Sharma:
          </motion.p>
          <motion.ul
            variants={itemVariants}
            className="list-disc list-inside mb-8 text-base md:text-lg space-y-2"
          >
            <li>
              Retired as General Manager from a leading oil company, bringing decades of leadership and insight into his literary work.

            </li>
            <li>
              Transitioned into writing with his debut novel Mirrro, marking the beginning of a celebrated literary journey.

            </li>
            <li>
              Honored with 20+ literary awards from prestigious organizations across India.

            </li>
            <li>
              Featured in over 200 media outlets and newspapers for his exemplary contributions to literature and society.

            </li>
            <li>
              Known for a clear, engaging, and emotionally resonant writing style that connects deeply with readers.

            </li>
            <li>
              Dedicated his literary work to his late mother Mrs. Hamelata Sharma, reflecting his strong family values.

            </li>
            <li>
              Draws inspiration and critical support from his father, wife, and son, who remain integral to his creative process.

            </li>
            <li>
              Authored four impactful books: Mirrro, Juhu, Me No Pause Me Play, and Hi God How Are You (most recent).

            </li>
            <li>
              Honored by prestigious literary forums including Yatha Katha, Aghaaz, Aaweg, ICMDR, and Azadi Ka Amrit Mahotsav Series.
            </li>
            <li>
              Renowned for contemporary fiction that explores women’s lives, global peace, and human rights issues.
            </li>
          </motion.ul>
          <motion.p
            variants={itemVariants}
            className="mb-4 text-lg md:text-xl font-semibold"
          >
            Manoj Kumar Sharma's exploration in world of Cinema:
          </motion.p>
          <motion.ul
            variants={itemVariants}
            className="list-disc list-inside text-base md:text-lg space-y-2"
          >
            <li>
              Writer and Producer of Me No Pause Me Play, a Hindi film that tackles menopause and talks about female identity.

            </li>
            <li>
              Acted alongside prominent stars like Kamya Punjabi and Deepshikha Nagpal, portraying themes of resilience in women’s lives.

            </li>
            <li>Featured a powerful title track by Usha Uthup, adding musical gravitas to the film’s message of awareness and empowerment.

            </li>
          </motion.ul>
        </motion.div>
      </motion.section>

      {/* Section 3: Awards & Recognition */}
      <motion.section
        variants={itemVariants}
        className="bg-gradient-to-b from-amber-50 to-amber-100 py-12 md:py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h3
            variants={itemVariants}
            className="text-center text-amber-900 font-bold text-2xl md:text-3xl mb-4"
          >
            AWARDS &amp; RECOGNITION
          </motion.h3>
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-12"
          >
            <div className="w-24 h-[3px] bg-amber-500 rounded" />
            <div className="w-2 h-2 rounded-full bg-amber-500 mx-2" />
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <div className="w-2 h-2 rounded-full bg-amber-500 ml-2" />
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8"
          >
            {[
              // "c2196530-78b2-4f1d-473f-cb2fd8779a98",
              // "c5a5eb7a-54e4-48c7-9008-4ce857b3acea",
              // "004c56ec-d1bb-4451-7697-a9da33a93a97",
              // "bda01c96-d247-45e0-6dd9-457a15a3788a",
              // "e6a38350-41b8-4e49-0e04-a267d847faab",
              // "ce684ad1-08a0-42a2-4ae1-cb598cb0e5a2",
              // "6e08ce78-da6d-4bec-35c4-6bba50a957da",
              // "76a86088-9dce-48b6-cea1-a64415959a04",
              // "e3a7f4a1-6cc7-42f4-9491-dbe7d3d463a4",
            ].map((imgId, index) => (
              <motion.img
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                alt={`Award image ${index + 1}`}
                className="w-full h-auto object-contain border-4 border-amber-600 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
                src={`https://storage.googleapis.com/a1aa/image/${imgId}.jpg`}
                width={300}
                height={300}
              />
            ))}
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8"
          >
            {[
              "Awards ",
              "Certifications",
              "Coming Soon",
              "Coming Soon",
            ].map((_, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center w-full h-40 border-4 border-amber-600 rounded-lg shadow-lg text-xl font-semibold text-gray-700 bg-gray-200"
              >
                Awards & Certificates
              </motion.div>
            ))}
          </motion.div>

        </div>
      </motion.section>
    </motion.div>
  );
}
