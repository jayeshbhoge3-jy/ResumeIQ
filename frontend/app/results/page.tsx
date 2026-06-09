"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ResultsPage() {
  const [results, setResults] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showToast, setShowToast] = useState(false);

  const nextSlide = () => {
    if (results?.rewrites) {
      setCurrentSlide((prev) => (prev + 1) % results.rewrites.length);
    }
  };
  
  const prevSlide = () => {
    if (results?.rewrites) {
      setCurrentSlide((prev) => (prev === 0 ? results.rewrites.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    const data = localStorage.getItem("resumeResults");
    if (data) {
      try {
        setResults(JSON.parse(data));
      } catch (e) {
        console.error("Error parsing resumeResults from localStorage", e);
        setResults({ error: "Failed to load scan results. The data might be corrupted." });
      }
    } else {
      // Mock data
      setResults({
        ats_score: 85,
        sub_scores: { keyword_score: 80, format_score: 90, impact_score: 85, alignment_score: 85 },
        missing_keywords: ["Kubernetes", "AWS", "Agile", "Tableau", "Go-to-Market"],
        found_keywords: ["React", "Python", "FastAPI", "PostgreSQL", "Data Analysis", "SQL", "Leadership"],
        rewrites: [
          { old: "Worked on the backend API.", new: "Architected a scalable backend API using FastAPI, increasing throughput by 40%." },
          { old: "Helped team with deployment.", new: "Streamlined CI/CD deployment pipelines, reducing deployment time by 20 mins." },
          { old: "Managed a team of developers to build the web app.", new: "Directed a team of 5 engineers to deliver a high-performance React application, leading to a 15% increase in user engagement." }
        ]
      });
    }
  }, []);

  const handleDownloadTips = () => {
    if (!results) return;
    
    let content = "ResumeIQ - Optimization Tips\n\n";
    content += `Overall ATS Score: ${results.ats_score}\n\n`;
    content += "Missing Keywords to Add:\n";
    results.missing_keywords?.forEach((kw: string) => { content += `- ${kw}\n`; });
    content += "\nAI Suggested Bullet Rewrites:\n";
    results.rewrites?.forEach((rw: any) => {
      content += `Original: ${rw.old}\n`;
      content += `Improved: ${rw.new}\n\n`;
    });
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Resume_Optimization_Tips.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!results) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500 bg-[#F8FAFC]">Loading results...</div>;
  }

  if (results.error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-slate-800 gap-6">
        <span className="material-symbols-outlined text-[64px] text-red-500">error</span>
        <h1 className="text-3xl font-bold">Analysis Failed</h1>
        <p className="text-slate-600 max-w-md text-center">{results.error}</p>
        <Link href="/upload" className="bg-[#1FC79B] text-white px-6 py-2 rounded-lg hover:bg-[#18a982] transition-colors mt-4 shadow-sm">
          Try Again
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white text-[#1a1a2e]">
      
      {/* Main Content Wrapper */}
      <main className="relative z-10 pt-[120px] pb-24 px-4 md:px-8 xl:px-12 max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Header & Action Row */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
        >
            <div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight mb-2">Analysis Results</h1>
                <p className="text-lg text-slate-600 max-w-2xl">
                    We've scanned your resume against 50+ industry data points. Here is your competitive breakdown.
                </p>
            </div>
            <div className="flex flex-wrap gap-3">
                <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">share</span> Share
                </button>
                <Link href="/upload" className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">replay</span> Analyze another
                </Link>
                <button onClick={handleDownloadTips} className="bg-[#1FC79B] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#18a982] hover:-translate-y-0.5 transition-all shadow-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">download</span> Download Tips
                </button>
            </div>
        </motion.div>

        {/* Top Section: Score & Interpretation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Score Hero Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-[#E5E7EB] shadow-sm rounded-3xl p-8 lg:col-span-4 flex flex-col items-center justify-center relative overflow-hidden"
            >
                <h2 className="text-xl font-bold text-slate-700 mb-6">Overall ATS Fit</h2>
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* SVG Circle Progress */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle className="text-slate-100" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="8"></circle>
                        <motion.circle 
                            initial={{ strokeDashoffset: 283 }}
                            animate={{ strokeDashoffset: 283 - (results.ats_score / 100) * 283 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`${results.ats_score > 75 ? 'text-[#1FC79B]' : results.ats_score > 50 ? 'text-[#FFB86F]' : 'text-red-500'}`} 
                            cx="50" cy="50" fill="none" r="45" 
                            stroke="currentColor" strokeDasharray="283"
                            strokeLinecap="round" strokeWidth="8" 
                        ></motion.circle>
                    </svg>
                    <div className="flex flex-col items-center text-center">
                        <span className={`text-6xl font-bold ${results.ats_score > 75 ? 'text-[#1FC79B]' : results.ats_score > 50 ? 'text-[#FFB86F]' : 'text-red-500'}`}>
                            {results.ats_score}
                        </span>
                        <span className="text-slate-400 font-medium">/ 100</span>
                    </div>
                </div>
                {/* Score Interpretation Label */}
                <div className="mt-4 flex flex-col items-center text-center">
                  {results.ats_score >= 85 && <span className="px-4 py-1.5 rounded-full bg-[#1FC79B]/10 text-[#003827] font-bold">Excellent</span>}
                  {results.ats_score >= 70 && results.ats_score < 85 && <span className="px-4 py-1.5 rounded-full bg-[#3B82F6]/10 text-[#1E3A8A] font-bold">Good - Keep Improving</span>}
                  {results.ats_score >= 50 && results.ats_score < 70 && <span className="px-4 py-1.5 rounded-full bg-[#FFB86F]/10 text-[#7A3E00] font-bold">Below Average</span>}
                  {results.ats_score < 50 && <span className="px-4 py-1.5 rounded-full bg-[#EF4444]/10 text-[#7F1D1D] font-bold">Needs Major Work</span>}
                </div>
                {/* One line tip based on lowest score */}
                {results.tips && results.tips.length > 0 && (
                  <div className="mt-6 bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-600 w-full text-center">
                    <span className="font-semibold text-slate-800">Tip:</span> {results.tips[0]}
                  </div>
                )}
            </motion.div>

            {/* Interpretation & Sub-scores */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Interpretation Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white border border-[#E5E7EB] shadow-sm rounded-3xl p-8 flex flex-col justify-between"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            {results.ats_score > 75 ? (
                              <>
                                <span className="material-symbols-outlined text-[#1FC79B] text-[32px]">check_circle</span>
                                <h3 className="text-2xl font-bold text-slate-800">Excellent Fit</h3>
                              </>
                            ) : results.ats_score > 50 ? (
                              <>
                                <span className="material-symbols-outlined text-[#FFB86F] text-[32px]">info</span>
                                <h3 className="text-2xl font-bold text-slate-800">Good — needs improvement</h3>
                              </>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-red-500 text-[32px]">warning</span>
                                <h3 className="text-2xl font-bold text-slate-800">Needs Work</h3>
                              </>
                            )}
                        </div>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            {results.ats_score > 75 
                              ? "Your resume parses perfectly and highlights strong quantifiable metrics aligned directly with the target role."
                              : "Your resume demonstrates a solid foundation but lacks specific quantifiable impact metrics. It parses well, but the narrative layer requires optimization."}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-[#FFB86F]/10 text-[#7A3E00] border border-[#FFB86F]/30 rounded-full text-sm font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">bolt</span> Action Verbs
                        </span>
                        <span className="px-3 py-1 bg-[#A390E4]/10 text-[#2A1866] border border-[#A390E4]/30 rounded-full text-sm font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">data_usage</span> Quantify Impact
                        </span>
                        <span className="px-3 py-1 bg-[#1FC79B]/10 text-[#003827] border border-[#1FC79B]/30 rounded-full text-sm font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">compress</span> Reduce Clutter
                        </span>
                    </div>
                </motion.div>

                {/* Sub-scores Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white border border-[#E5E7EB] shadow-sm rounded-3xl p-8 flex flex-col justify-center gap-6"
                >
                    {[
                        { label: 'Keyword Match', score: results.sub_scores?.keyword_score || 0, color: 'bg-[#1FC79B]' },
                        { label: 'Format', score: results.sub_scores?.format_score || 0, color: 'bg-[#1FC79B]' },
                        { label: 'Impact', score: results.sub_scores?.impact_score || 0, color: 'bg-[#1FC79B]' },
                        { label: 'Alignment', score: results.sub_scores?.alignment_score || 0, color: 'bg-[#1FC79B]' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                            <span className="w-1/3 text-sm font-semibold text-slate-500 uppercase tracking-wider">{item.label}</span>
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.score}%` }}
                                    transition={{ duration: 1, delay: 0.4 + (idx * 0.1) }}
                                    className={`h-full rounded-full ${item.color}`}
                                />
                            </div>
                            <span className="w-8 text-right font-bold text-slate-700">{item.score}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>

        {/* Lower Section: Keywords & Rewrites */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Keyword Analysis */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white border border-[#E5E7EB] shadow-sm rounded-3xl p-8 flex flex-col lg:col-span-5 h-[550px]"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Keyword Analysis</h3>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Job Description</span>
                </div>
                
                <div className="flex flex-col gap-6 flex-1 overflow-hidden">
                    {/* Found Keywords */}
                    <div className="flex-1 flex flex-col bg-slate-50 rounded-2xl p-5 border border-slate-100 overflow-hidden">
                        <div className="text-[#1FC79B] font-bold text-sm flex items-center gap-2 mb-4 shrink-0">
                            <span className="material-symbols-outlined text-[18px]">check_circle</span> Found ({results.found_keywords?.length || 0})
                        </div>
                        <div className="flex flex-wrap gap-2 overflow-y-auto pr-2 custom-scrollbar">
                            {(results.found_keywords || []).map((kw: string, i: number) => (
                                <span key={i} className="px-3 py-1.5 bg-[#D1FAE5] text-[#065F46] rounded-lg text-sm font-medium shadow-sm cursor-default">
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    {/* Missing Keywords */}
                    <div className="flex-1 flex flex-col bg-slate-50 rounded-2xl p-5 border border-slate-100 overflow-hidden">
                        <div className="text-red-500 font-bold text-sm flex items-center gap-2 mb-4 shrink-0">
                            <span className="material-symbols-outlined text-[18px]">cancel</span> Missing ({results.missing_keywords?.length || 0})
                        </div>
                        <div className="flex flex-wrap gap-2 overflow-y-auto pr-2 custom-scrollbar">
                            {(results.missing_keywords || []).map((kw: string, i: number) => (
                                <span key={i} className="px-3 py-1.5 bg-[#FEE2E2] text-[#DC2626] rounded-lg text-sm font-medium shadow-sm cursor-default">
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* AI Bullet Rewrites Slider */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white border border-[#E5E7EB] shadow-sm rounded-3xl p-8 flex flex-col lg:col-span-7 h-[550px]"
            >
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#1FC79B]">auto_awesome</span> AI Bullet Rewrites
                    </h3>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                            {results?.rewrites?.length ? currentSlide + 1 : 0} of {results?.rewrites?.length || 0}
                        </span>
                        <div className="flex gap-2">
                            <button onClick={prevSlide} className="w-10 h-10 rounded-full border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 hover:text-primary transition-all shadow-sm disabled:opacity-50" disabled={!results?.rewrites?.length}>
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button onClick={nextSlide} className="w-10 h-10 rounded-full border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 hover:text-primary transition-all shadow-sm disabled:opacity-50" disabled={!results?.rewrites?.length}>
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative overflow-hidden bg-slate-50 rounded-2xl border border-slate-100 p-6">
                    {results?.rewrites && results.rewrites.length > 0 ? (
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentSlide}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="h-full flex flex-col gap-6"
                            >
                                {/* Original Text */}
                                <div className="flex-1 flex flex-col bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#EF4444]"></div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        Original Text
                                    </div>
                                    <p className="text-slate-500 leading-relaxed overflow-y-auto pr-2 custom-scrollbar">
                                        {results.rewrites[currentSlide].old}
                                    </p>
                                </div>
                                
                                {/* Arrow Separator */}
                                <div className="flex justify-center -my-2 relative z-10">
                                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
                                    </div>
                                </div>

                                {/* Rewritten Text */}
                                <div className="flex-1 flex flex-col bg-white rounded-xl p-6 border-2 border-[#1FC79B]/30 shadow-md relative overflow-hidden hover:border-[#1FC79B] transition-colors">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1FC79B]"></div>
                                    <div className="text-xs font-bold text-[#1FC79B] uppercase tracking-wider mb-3 flex items-center gap-2">
                                        AI Optimized Result
                                    </div>
                                    <p className="text-slate-800 font-medium leading-relaxed text-lg overflow-y-auto pr-2 custom-scrollbar">
                                        {results.rewrites[currentSlide].new}
                                    </p>
                                    
                                    <button className="absolute bottom-4 right-4 text-slate-400 hover:text-[#1FC79B] transition-colors bg-slate-50 p-2 rounded-lg" title="Copy to clipboard" onClick={() => {
                                        navigator.clipboard.writeText(results.rewrites[currentSlide].new);
                                        setShowToast(true);
                                        setTimeout(() => setShowToast(false), 2000);
                                    }}>
                                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                    </button>
                                    
                                    <AnimatePresence>
                                        {showToast && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute bottom-14 right-4 bg-slate-800 text-white text-xs px-3 py-1.5 rounded shadow-lg"
                                            >
                                                Copied!
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                      <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full gap-4">
                        <span className="material-symbols-outlined text-[48px] text-slate-300">task_alt</span>
                        <p>No weak bullets found to rewrite. Good job!</p>
                      </div>
                    )}
                </div>
            </motion.div>
        </div>

      </main>

      {/* Bottom Action Section */}
      <div className="w-full flex justify-center pb-16 relative z-10">
        <Link 
            href="/upload" 
            onClick={() => localStorage.removeItem("resumeResults")}
            className="bg-white border border-[#E5E7EB] text-slate-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-[#1FC79B] hover:text-[#1FC79B] transition-all shadow-sm flex items-center gap-2"
        >
            <span className="material-symbols-outlined">restart_alt</span> Analyze Another Resume
        </Link>
      </div>
      
      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div className="text-2xl font-bold text-slate-800">
                Resume<span className="text-[#1FC79B]">IQ</span> 
                <span className="text-slate-500 text-sm font-normal ml-0 md:ml-4 mt-2 md:mt-0 block md:inline">— Built with AI to get you hired</span>
            </div>
            <ul className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-medium text-slate-500">
                <li><a className="hover:text-slate-800 transition-colors" href="#">Privacy Policy</a></li>
                <li><a className="hover:text-slate-800 transition-colors" href="#">Terms of Service</a></li>
                <li><a className="hover:text-slate-800 transition-colors" href="#">Contact Support</a></li>
            </ul>
        </div>
      </footer>
    </div>
  );
}
