'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart, FiExternalLink, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { booksAPI } from '@/services/api';
import { useCart } from '@/app/components/CartContext';

const ProductPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadBook = async () => {
      setLoading(true);
      setNotFound(false);
      console.log("🔍 Searching for book ->", slug);

      // 1️⃣ Try server by ID
      try {
        const res = await booksAPI.getById(slug);
        if (res?.data?.data) {
          setProduct(res.data.data);
          console.log("📌 Loaded from API (ID)");
          return;
        }
      } catch (err) {
        console.warn("❌ API ID fetch failed");
      }

      // 2️⃣ Try server by slug
      try {
        const res = await booksAPI.getBySlug(slug);
        if (res?.data?.data) {
          setProduct(res.data.data);
          console.log("📌 Loaded from API (Slug)");
          return;
        }
      } catch (err) {
        console.warn("❌ API Slug fetch failed");
      }

      // 3️⃣ Fallback → load from local books.json
      try {
        const url = `${window.location.origin}/books.json`; // FIX here
        const res = await fetch(url);

        if (res.ok) {
          const list = await res.json();
          const match = list.find((b: any) => b.slug === slug);

          if (match) {
            console.log("📌 Loaded locally from books.json");
            setProduct(match);
            return;
          }
        } else {
          console.error("❌ Local JSON fetch failed status:", res.status);
        }
      } catch (err) {
        console.error("❌ Error reading books.json", err);
      }

      setNotFound(true);
    };

    loadBook();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, id: product._id || product.slug });
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );

  if (notFound || !product)
    return (
      <div className="min-h-screen flex justify-center items-center text-center">
        <div>
          <h2 className="text-2xl font-bold">Book Not Found</h2>
          <p className="text-gray-500 mb-3">{error ?? "Try again later"}</p>
          <Link href="/published-book" className="text-blue-600 underline flex justify-center gap-2">
            <FiArrowLeft /> Back
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <Link href="/published-book" className="inline-flex items-center text-blue-600 mb-6">
          <FiArrowLeft className="mr-2" /> Back
        </Link>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 shadow-lg rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
            <img
              src={product.image || product.coverImage}
              alt={product.title}
              className="object-cover w-full h-full"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <div className="flex items-center mt-3 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={`${i < product.rating ? "fill-yellow-500" : ""}`} />
              ))}
              <span className="ml-2 text-gray-500">({product.reviews ?? 0} reviews)</span>
            </div>

            <p className="text-gray-600 mt-3">{product.description}</p>

            <button
              onClick={handleAddToCart}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <FiShoppingCart /> Add to Cart - ₹{product.price}
            </button>

            {product.amazonLink && (
              <a
                href={product.amazonLink}
                target="_blank"
                className="w-full mt-3 block border py-3 text-center rounded-lg"
              >
                <FiExternalLink className="inline-block mr-2" />
                Buy on Amazon
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductPage;
