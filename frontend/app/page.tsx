"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import ResumeGraderAnimation from "../components/ResumeGraderAnimation";

export default function Home() {
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
      "http://localhost:8000";
    fetch(`${apiUrl}/api/health`).catch(() => {});
  }, []);

  return (
    <main className="flex-grow flex flex-col pt-[80px] relative bg-white min-h-screen">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.15)_0%,transparent_70%)] pointer-events-none z-0"></div>
      
      {/* Subtle floating dots */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-gray-300"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[60%] left-[5%] w-3 h-3 rounded-full bg-gray-200"
        />
        <motion.div 
          animate={{ y: [0, -15, 0], opacity: [0.4, 0.7, 0.4] }} 
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[20%] right-[40%] w-1.5 h-1.5 rounded-full bg-gray-300"
        />
        <div className="absolute top-1/3 left-16 w-2 h-2 rounded-full bg-[#D1D5DB] opacity-60"></div>
        <div className="absolute bottom-1/3 left-8 w-2 h-2 rounded-full bg-[#D1D5DB] opacity-60"></div>
      </div>

      {/* Hero Section */}
      <section className="relative flex items-center px-6 md:px-12 xl:px-24 pt-12 pb-24 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* Hero Left - Copy & CTAs */}
          <div className="flex flex-col items-start space-y-8 z-20">
            <h1 className="text-[52px] md:text-[64px] font-extrabold leading-[1.1] text-[#1a1a2e] tracking-tight">
              Get hired faster with <br className="hidden md:block"/>
              <span className="text-[#1FC79B]">ResumeIQ&#39;s AI Scorer</span>
            </h1>
            
            <p className="text-xl text-[#6B7280] max-w-lg leading-relaxed">
              ATS Check, AI Rewrites, and Keyword Gap Analysis to make your resume stand out to recruiters.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/upload" className="flex items-center justify-center bg-[#1FC79B] text-white font-semibold px-8 py-4 rounded-lg hover:bg-[#18a982] transition-colors shadow-lg shadow-[#1FC79B]/20">
                Analyze Your Resume
              </Link>
              <Link href="/upload" className="flex items-center justify-center bg-white text-[#1a1a2e] font-semibold border-2 border-gray-800 px-8 py-4 rounded-lg hover:border-[#1FC79B] hover:text-[#1FC79B] transition-colors">
                Get Your Score
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4 border-t border-gray-100 w-full sm:w-auto mt-4">
              <div className="flex items-center gap-2">
                <div className="flex text-[#F59E0B]">
                  {/* 5 Stars */}
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  ))}
                </div>
                <span className="text-sm font-semibold text-[#1a1a2e] flex items-center gap-2 whitespace-nowrap">4.5 <span className="text-[#6B7280] font-normal">(5,260 Reviews)</span></span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#6B7280]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                </div>
                <span className="text-sm font-medium text-[#6B7280]">28,452 users got more interviews</span>
              </div>
            </div>
          </div>

          {/* Hero Right - Animated Resume Grader */}
          <div className="relative w-full h-[500px] flex justify-center items-center mt-12 lg:mt-0 z-10">
            {/* Lavender Radial Gradient Behind Animation */}
            <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.12)_0%,transparent_70%)] pointer-events-none z-[-1]"></div>
            
            {/* Subtle green glow behind machine */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#1FC79B]/20 blur-[80px] rounded-full pointer-events-none"></div>
            
            <ResumeGraderAnimation />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full border-t border-gray-100 bg-white flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-8 gap-4 text-center md:text-left mt-auto">
        <div className="font-bold text-xl text-[#1a1a2e] flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#1FC79B] flex items-center justify-center text-white text-[10px]">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          ResumeIQ
        </div>
        <div className="text-sm text-[#6B7280]">
          ResumeIQ — Built with AI to get you hired
        </div>
        <div className="flex gap-6 text-sm font-medium text-[#6B7280]">
          <a className="hover:text-[#1FC79B] transition-colors" href="#">Privacy</a>
          <a className="hover:text-[#1FC79B] transition-colors" href="#">Terms</a>
          <a className="hover:text-[#1FC79B] transition-colors" href="#">Support</a>
        </div>
      </footer>
    </main>
  );
}
