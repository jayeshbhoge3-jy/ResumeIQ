"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a2e] flex flex-col pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-12">
        
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-slate-800 tracking-tight">
            About Resume<span className="text-[#1FC79B]">IQ</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Built by a developer, for developers who want to get hired faster.
          </p>
        </section>

        {/* How it works */}
        <section className="bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#1FC79B]/10 flex items-center justify-center text-[#1FC79B]">
                <span className="material-symbols-outlined text-3xl">upload_file</span>
              </div>
              <h3 className="font-bold text-slate-800">Step 1</h3>
              <p className="text-slate-600 text-sm">Upload your resume in PDF format.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#1FC79B]/10 flex items-center justify-center text-[#1FC79B]">
                <span className="material-symbols-outlined text-3xl">psychology</span>
              </div>
              <h3 className="font-bold text-slate-800">Step 2</h3>
              <p className="text-slate-600 text-sm">AI analyzes it against the target job description.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#1FC79B]/10 flex items-center justify-center text-[#1FC79B]">
                <span className="material-symbols-outlined text-3xl">monitoring</span>
              </div>
              <h3 className="font-bold text-slate-800">Step 3</h3>
              <p className="text-slate-600 text-sm">Get your ATS score and AI-driven improvements.</p>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Powered By</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {["Next.js 14", "FastAPI", "Groq LLaMA 70B", "PostgreSQL", "Framer Motion", "GSAP", "Tailwind CSS", "spaCy NLP", "Docker"].map((tech) => (
              <span key={tech} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium shadow-sm cursor-default">
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Builder Card */}
        <section className="flex justify-center mt-4">
          <div className="bg-white border-2 border-[#1FC79B]/20 shadow-lg rounded-2xl p-8 max-w-sm w-full flex flex-col items-center text-center gap-4 hover:border-[#1FC79B] transition-colors">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden">
              <span className="material-symbols-outlined text-4xl">person</span>
            </div>
            <div>
              <div className="text-xs font-bold text-[#1FC79B] uppercase tracking-wider mb-1">Built By</div>
              <h3 className="text-2xl font-bold text-slate-800">Jayesh Bhoge</h3>
              <p className="text-slate-500 font-medium">Full Stack Developer — Pune, India</p>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <Link href="https://github.com/jayeshbhoge3-jy" target="_blank" className="flex-1 bg-slate-800 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors">
                GitHub
              </Link>
              <Link href="https://linkedin.com/in/jayesh-bhoge-1b246a267/" target="_blank" className="flex-1 bg-[#0A66C2] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#004182] transition-colors">
                LinkedIn
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
