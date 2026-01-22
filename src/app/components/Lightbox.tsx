'use client';
import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';

interface LightboxProps {
    images: { src: string; alt: string; type?: 'image' | 'video' }[];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({
    images,
    currentIndex,
    isOpen,
    onClose,
    onNext,
    onPrev,
}) => {
    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;

        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowRight' && onNext) onNext();
        if (e.key === 'ArrowLeft' && onPrev) onPrev();
    }, [isOpen, onClose, onNext, onPrev]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        // Prevent scrolling when lightbox is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleKeyDown]);

    if (!images[currentIndex]) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    onClick={onClose}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-[110]"
                    >
                        <FiX size={32} />
                    </button>

                    {/* Navigation Buttons */}
                    {onPrev && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onPrev();
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all z-[110]"
                        >
                            <FiChevronLeft size={32} />
                        </button>
                    )}

                    {onNext && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onNext();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all z-[110]"
                        >
                            <FiChevronRight size={32} />
                        </button>
                    )}

                    {/* Main Content */}
                    <div
                        className="relative w-full max-w-7xl max-h-[90vh] flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", duration: 0.3 }}
                            className="relative w-full h-full flex items-center justify-center"
                        >
                            {images[currentIndex].type === 'video' ? (
                                <video
                                    src={images[currentIndex].src}
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
                                />
                            ) : (
                                <div className="relative w-auto h-auto max-w-full max-h-[85vh]">
                                    <img
                                        src={images[currentIndex].src}
                                        alt={images[currentIndex].alt}
                                        className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                                    />
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Caption/Counter */}
                    <div className="absolute bottom-6 left-0 right-0 text-center text-white/80 z-[110]">
                        <p className="text-lg font-medium mb-1">{images[currentIndex].alt}</p>
                        <p className="text-sm">
                            {currentIndex + 1} / {images.length}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Lightbox;
