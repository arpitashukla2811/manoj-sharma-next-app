'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const PrivacyPage = () => {
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
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-[var(--saffron-light)] max-w-2xl mx-auto"
          >
            Your privacy is important to us. Learn how we collect, use, and protect your information.
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

              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">1. Information We Collect</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, postal address, phone number, and payment information.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">2. How We Use Your Information</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">3. Information Sharing</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with trusted third parties who assist us in operating our website and conducting our business.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">4. Data Security</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">5. Cookies and Tracking</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">6. Your Rights</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                You have the right to access, update, or delete your personal information. You may also opt out of receiving promotional communications from us by following the unsubscribe instructions in those communications.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">7. Children's Privacy</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">8. Changes to This Policy</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "last updated" date.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">9. Contact Us</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                If you have any questions about this privacy policy, please contact us at{' '}
                <a href="mailto:manojkumarsharmma@gmail.com" className="text-[var(--saffron-primary)] hover:underline">
                  manojkumarsharmma@gmail.com
                </a>
                {' '}or by phone at{' '}
                <a href="tel:9819612604" className="text-[var(--saffron-primary)] hover:underline">
                  +91 9819612604
                </a>.
              </p>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-[var(--text-secondary)] text-center">
                  Your privacy matters to us. Thank you for trusting Manoj Kumar Sharma with your personal information.
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

export default PrivacyPage;