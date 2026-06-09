"use client";

import { motion } from "framer-motion";

export default function ResumeGraderAnimation() {
  return (
    <div className="relative w-full max-w-lg h-[500px] flex items-center justify-center -ml-4 md:ml-0 transform scale-90 md:scale-100">
      
      {/* 
        THE MACHINE ASSEMBLY 
      */}
      <div className="relative flex items-center justify-center w-full h-full">
        
        {/* The Paper / Resume (Animates downwards) */}
        <motion.div 
          animate={{ y: [-100, 100] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute z-10 w-[280px] h-[380px] bg-white rounded-md shadow-lg p-5 border border-slate-200 left-[140px]"
        >
          {/* Fake Resume Header */}
          <div className="border-b-2 border-slate-100 pb-3 mb-4">
            <div className="h-4 w-32 bg-slate-800 rounded mb-2"></div>
            <div className="h-2 w-48 bg-primary/40 rounded mb-1"></div>
            <div className="h-2 w-full bg-slate-200 rounded"></div>
          </div>
          
          {/* Fake Resume Body */}
          <div className="space-y-4">
            <div>
              <div className="h-3 w-24 bg-slate-300 rounded mb-2"></div>
              <div className="h-1.5 w-full bg-slate-200 rounded mb-1.5"></div>
              <div className="h-1.5 w-full bg-slate-200 rounded mb-1.5"></div>
              <div className="h-1.5 w-4/5 bg-slate-200 rounded"></div>
            </div>
            <div>
              <div className="h-3 w-32 bg-slate-300 rounded mb-2"></div>
              <div className="h-1.5 w-full bg-slate-200 rounded mb-1.5"></div>
              <div className="h-1.5 w-5/6 bg-slate-200 rounded mb-1.5"></div>
              <div className="h-1.5 w-full bg-slate-200 rounded"></div>
            </div>
            <div>
              <div className="h-3 w-20 bg-slate-300 rounded mb-2"></div>
              <div className="h-1.5 w-full bg-slate-200 rounded mb-1.5"></div>
              <div className="h-1.5 w-3/4 bg-slate-200 rounded"></div>
            </div>
          </div>
        </motion.div>

        {/* 
          LEFT SIDE: Grader Console
        */}
        <div className="absolute left-0 z-30 w-[140px] h-[320px] bg-[#2A2B3A] rounded-xl shadow-2xl flex flex-col items-center py-6 border border-slate-700/50">
          <div className="text-white/80 font-bold tracking-[0.2em] text-xs text-center leading-tight mb-6">
            RESUME<br/>GRADER
          </div>

          {/* Gauge */}
          <div className="relative w-20 h-10 overflow-hidden mb-6">
            <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-[6px] border-slate-600 border-t-red-500 border-r-yellow-500 border-l-green-500 transform rotate-45"></div>
            {/* Needle */}
            <motion.div 
              animate={{ rotate: [-40, 40, -10, 20, -40] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 left-1/2 w-1 h-10 bg-white origin-bottom rounded-t-full transform -translate-x-1/2"
            />
            {/* Needle Base */}
            <div className="absolute bottom-[-4px] left-1/2 w-3 h-3 bg-yellow-400 rounded-full transform -translate-x-1/2"></div>
          </div>

          {/* Heartbeat Monitor 1 */}
          <div className="w-24 h-10 bg-[#1A1A24] rounded-md mb-3 border border-slate-700/50 relative overflow-hidden flex items-center">
            <motion.svg 
              animate={{ x: [-50, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              viewBox="0 0 100 20" className="w-[200%] h-full stroke-slate-400 fill-none" strokeWidth="1.5"
            >
              <path d="M0,10 L20,10 L25,5 L30,15 L35,10 L50,10 L70,10 L75,5 L80,15 L85,10 L100,10" />
            </motion.svg>
          </div>

          {/* Heartbeat Monitor 2 */}
          <div className="w-24 h-6 bg-[#1A1A24] rounded-md mb-6 border border-slate-700/50 relative overflow-hidden flex items-center">
            <motion.svg 
              animate={{ x: [-50, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              viewBox="0 0 100 20" className="w-[200%] h-full stroke-slate-400 fill-none" strokeWidth="1"
            >
               <path d="M0,10 L10,10 L12,2 L16,18 L18,10 L50,10 L60,10 L62,2 L66,18 L68,10 L100,10" />
            </motion.svg>
          </div>

          {/* Status Lights */}
          <div className="flex gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-slate-500"></div>
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            />
            <div className="w-3 h-3 rounded-full bg-slate-500"></div>
            <div className="w-3 h-3 rounded-full bg-slate-500"></div>
          </div>

          {/* Bottom Slot */}
          <div className="w-16 h-3 bg-[#1A1A24] rounded-full shadow-inner"></div>
        </div>

        {/* Connection Arm */}
        <div className="absolute left-[130px] z-20 w-12 h-6 bg-slate-600 rounded-r-md border-y border-r border-slate-700/50"></div>

        {/* 
          RIGHT SIDE: Scanner Bed Overlays
        */}
        {/* Top Scanner Cover (Hides top of paper) */}
        <div className="absolute z-20 top-[40px] left-[140px] w-[300px] h-[60px] bg-[#3B3D4F] rounded-t-xl shadow-xl border-t border-x border-slate-600/50 flex flex-col justify-end pb-2">
            <div className="w-full h-2 bg-black/20"></div>
        </div>

        {/* Bottom Scanner Bed (Hides bottom of paper & shows laser) */}
        <div className="absolute z-20 bottom-[40px] left-[140px] w-[300px] h-[160px] bg-[#2A2B3A] rounded-b-xl shadow-2xl border-b border-x border-slate-700/50 overflow-hidden flex flex-col">
          
          {/* Inner Scan Window */}
          <div className="mx-4 mt-4 h-[90px] bg-[#1A1A24] rounded-md border border-slate-700/50 relative overflow-hidden shadow-inner flex items-center justify-center">
            
            {/* Dark tint over the paper passing beneath */}
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            
            {/* The Laser Scanner */}
            <motion.div 
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute z-20 w-[120%] h-1 bg-[#FFB86F] shadow-[0_0_15px_#FFB86F]"
            >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_white]"></div>
            </motion.div>

          </div>
          
          <div className="flex-1 bg-gradient-to-t from-[#1F202E] to-[#2A2B3A]"></div>
        </div>

      </div>
    </div>
  );
}
