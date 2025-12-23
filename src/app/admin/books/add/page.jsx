'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiArrowLeft, FiBookOpen, FiUpload, FiX, FiImage } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../components/AdminLayout';
import { booksAPI, uploadAPI } from '@/services/api';
import { AdminAuthProvider } from '../../../components/AdminAuthContext';
import AdminProtectedRoute from '../../../components/AdminProtectedRoute';

function AddBook() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    author: '',
    price: '',
    rating: 0,
    reviews: 0,
    year: new Date().getFullYear(),
    genre: 'Self-help',
    stock: 0,
    language: 'English',
    format: 'Paperback',
    amazonLink: '',
    coverImage: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleImageFile = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB.');
      return;
    }

    setImageFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, coverImage: '' }));
  };

  const uploadImage = async () => {
    if (!imageFile) {
      setError('Please select an image to upload.');
      return;
    }

    try {
      const response = await uploadAPI.uploadSingle(imageFile);
      
      if (response.data.success) {
        setFormData(prev => ({ ...prev, coverImage: response.data.data.url }));
        setSuccess('Image uploaded successfully!');
        return response.data.data.url;
      } else {
        throw new Error(response.data.message || 'Failed to upload image');
      }
    } catch (error) {
      setError('Failed to upload image. Please try again.');
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Upload image first if selected
      let imageUrl = formData.coverImage;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      // Validate required fields
      if (!formData.title || !formData.description || !formData.author || !formData.price) {
        setError('Please fill in all required fields (title, description, author, price)');
        setIsSubmitting(false);
        return;
      }

      // Convert and validate data
      const bookData = {
        ...formData,
        coverImage: imageUrl,
        price: parseFloat(formData.price),
        year: parseInt(formData.year),
        stock: parseInt(formData.stock),
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews),
        // Set default values for required fields
        fullDescription: formData.fullDescription || formData.description,
        genre: formData.genre || 'Self-help',
        language: formData.language || 'English',
        format: formData.format || 'Paperback'
      };

      const response = await booksAPI.create(bookData);
      
      if (response.data.success) {
        setSuccess('Book added successfully! Redirecting...');
        setTimeout(() => {
          router.push('/admin/books');
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to add book');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      setError(error.response?.data?.message || 'Error saving book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/admin/books">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
                  >
                    <FiArrowLeft className="w-5 h-5" />
                  </motion.button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Add New Book</h1>
                  <p className="mt-2 text-gray-600">Create a new book entry with all details</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-amber-600">
                <FiBookOpen className="w-6 h-6" />
                <span className="font-medium">Book Management</span>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6"
              >
                {success}
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Book Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Enter book title"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Short Description *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Brief description of the book"
                      />
                    </div>

                    <div>
                      <label htmlFor="fullDescription" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Description
                      </label>
                      <textarea
                        id="fullDescription"
                        name="fullDescription"
                        value={formData.fullDescription}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Detailed description of the book"
                      />
                    </div>

                    <div>
                      <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                        Author *
                      </label>
                      <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Author name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                          Publication Year *
                        </label>
                        <input
                          type="number"
                          id="year"
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          required
                          min="1900"
                          max="2030"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="2023"
                        />
                      </div>

                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                          Price *
                        </label>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          required
                          step="0.01"
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="19.99"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        <input
                          type="number"
                          id="rating"
                          name="rating"
                          value={formData.rating}
                          onChange={handleChange}
                          min="0"
                          max="5"
                          step="0.1"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="4.5"
                        />
                      </div>

                      <div>
                        <label htmlFor="reviews" className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Reviews
                        </label>
                        <input
                          type="number"
                          id="reviews"
                          name="reviews"
                          value={formData.reviews}
                          onChange={handleChange}
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                        Genre *
                      </label>
                      <input
                        type="text"
                        id="genre"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Self-help, Fiction, etc."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-2">
                          Format *
                        </label>
                        <select
                          id="format"
                          name="format"
                          value={formData.format}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value="Paperback">Paperback</option>
                          <option value="Hardcover">Hardcover</option>
                          <option value="eBook">eBook</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          id="language"
                          name="language"
                          value={formData.language}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                          <option value="Italian">Italian</option>
                          <option value="Portuguese">Portuguese</option>
                          <option value="Russian">Russian</option>
                          <option value="Chinese">Chinese</option>
                          <option value="Japanese">Japanese</option>
                          <option value="Korean">Korean</option>
                          <option value="Arabic">Arabic</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Bengali">Bengali</option>
                          <option value="Urdu">Urdu</option>
                          <option value="Turkish">Turkish</option>
                          <option value="Dutch">Dutch</option>
                          <option value="Swedish">Swedish</option>
                          <option value="Norwegian">Norwegian</option>
                          <option value="Danish">Danish</option>
                          <option value="Finnish">Finnish</option>
                          <option value="Polish">Polish</option>
                          <option value="Czech">Czech</option>
                          <option value="Hungarian">Hungarian</option>
                          <option value="Romanian">Romanian</option>
                          <option value="Bulgarian">Bulgarian</option>
                          <option value="Greek">Greek</option>
                          <option value="Hebrew">Hebrew</option>
                          <option value="Thai">Thai</option>
                          <option value="Vietnamese">Vietnamese</option>
                          <option value="Indonesian">Indonesian</option>
                          <option value="Malay">Malay</option>
                          <option value="Filipino">Filipino</option>
                          <option value="Persian">Persian</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="50"
                      />
                    </div>

                    <div>
                      <label htmlFor="amazonLink" className="block text-sm font-medium text-gray-700 mb-2">
                        Amazon Link
                      </label>
                      <input
                        type="url"
                        id="amazonLink"
                        name="amazonLink"
                        value={formData.amazonLink}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="https://www.amazon.com/book-link"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>



            {/* Image Upload Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Cover Image</h3>
              
              <div className="space-y-4">
                {/* Image Preview */}
                {(imagePreview || formData.coverImage) && (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview || formData.coverImage}
                      alt="Book cover preview"
                      className="w-32 h-40 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-300 hover:border-amber-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        {imageFile ? imageFile.name : 'Upload book cover image'}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </span>
                    </label>
                    <input
                      id="image-upload"
                      name="image-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => document.getElementById('image-upload').click()}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      <FiUpload className="w-4 h-4 mr-2" />
                      Choose File
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Or drag and drop an image here
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-end space-x-4">
                <Link href="/admin/books">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </Link>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSave className="w-5 h-5" />
                  {isSubmitting ? 'Saving...' : 'Save Book'}
                </motion.button>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
  );
}

export default function AddBookWrapper() {
  return (
    <AdminAuthProvider>
      <AdminProtectedRoute>
        <AdminLayout>
          <AddBook />
        </AdminLayout>
      </AdminProtectedRoute>
    </AdminAuthProvider>
  );
}
