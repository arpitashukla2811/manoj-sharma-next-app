'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const TermsPage = () => {
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
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-[var(--saffron-light)] max-w-2xl mx-auto"
          >
            Please read these terms carefully before using our services
          </motion.p>
        </div>
      </motion.section>

      {/* Content Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="py-20"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-8 md:p-12"
          >
            <div className="prose prose-lg max-w-none">
              <p className="text-sm text-gray-500 mb-8">
                Last updated: {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">1. Acceptance of Terms</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                By accessing and using the Manoj Kumar Sharma website and services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">2. Use License</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Permission is granted to temporarily download one copy of the materials on Manoj Kumar Sharma's website for personal, non-commercial transitory viewing only.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">3. Disclaimer</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                The materials on Manoj Kumar Sharma's website are provided on an 'as is' basis. Manoj Kumar Sharma makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">4. Limitations</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                In no event shall Manoj Kumar Sharma or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Manoj Kumar Sharma's website.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">5. Accuracy of Materials</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                The materials appearing on Manoj Kumar Sharma's website could include technical, typographical, or photographic errors. Manoj Kumar Sharma does not warrant that any of the materials on its website are accurate, complete, or current.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">6. Links</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Manoj Kumar Sharma has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Manoj Kumar Sharma of the site.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">7. Modifications</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Manoj Kumar Sharma may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">8. Governing Law</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
              </p>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-[var(--text-secondary)] text-center">
                  If you have any questions about these Terms of Service, please contact us at{' '}
                  <a href="mailto:manojkumarsharmma@gmail.com" className="text-[var(--saffron-primary)] hover:underline">
                    manojkumarsharmma@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="text-center mt-8"
          >
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default TermsPage;