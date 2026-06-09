"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-[-2] bg-[#F8FAFC] pointer-events-none overflow-hidden">
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-dots opacity-30" />
      
      {/* Floating blurred blobs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D2F4EB] rounded-full mix-blend-multiply filter blur-[100px] opacity-70"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#EAE4FC] rounded-full mix-blend-multiply filter blur-[120px] opacity-60"
      />
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 150, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#E0F2FE] rounded-full mix-blend-multiply filter blur-[80px] opacity-50"
      />
    </div>
  );
}
