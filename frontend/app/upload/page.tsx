"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("Initializing Scanner...");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".pdf") || droppedFile.name.endsWith(".docx")) {
        setFile(droppedFile);
      } else {
        alert("Please upload a PDF or DOCX file.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const statusMessagesList = [
    "Checking File Format...",
    "Scanning ATS Readability...",
    "Extracting Keywords...",
    "Analyzing Impact & Formatting...",
    "Preparing Final Report..."
  ];

  const handleAnalyze = async () => {
    if (!file || !jd) {
      alert("Please upload a resume and paste a job description.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Max 5MB allowed.");
      return;
    }

    setIsAnalyzing(true);
    let currentProgress = 0;
    let msgIndex = 0;

    const progressInterval = setInterval(() => {
        currentProgress += Math.random() * 8;
        if (currentProgress > 90) currentProgress = 90; // Hold at 90% until API returns
        setProgress(currentProgress);

        if (currentProgress > (msgIndex + 1) * 18 && msgIndex < statusMessagesList.length) {
            setStatusMsg(statusMessagesList[msgIndex]);
            msgIndex++;
        }
    }, 200);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("job_description", jd);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      
      clearInterval(progressInterval);
      setProgress(100);
      setStatusMsg("Scan Complete!");
      
      setTimeout(() => {
        localStorage.setItem("resumeResults", JSON.stringify(data));
        router.push("/results");
      }, 800);
      
    } catch (error) {
      console.error(error);
      clearInterval(progressInterval);
      alert("Failed to connect to backend. Make sure it's running.");
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-[#1a1a2e] flex flex-col overflow-x-hidden">
      
      {/* Mesh gradient background handled by globals.css body background */}

      <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-12 relative z-10">
        
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative">
            
            <div className={`p-8 md:p-12 flex flex-col gap-10 transition-opacity duration-300 ${isAnalyzing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-slate-800">Upload your Resume</h2>
                    <p className="text-slate-500">We'll compare it against the job description to get your ATS score.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    
                    {/* Left: Upload Zone */}
                    <div className="flex flex-col gap-4">
                        <div className="font-semibold text-sm text-slate-500 uppercase tracking-wider">1. Your Resume</div>
                        <div 
                            ref={dropZoneRef}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => !file && fileInputRef.current?.click()}
                            className={`relative h-[280px] rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden
                            ${isDragging ? 'border-[#1FC79B] bg-[#1FC79B]/10 animate-pulse' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-[#1FC79B]'}
                            ${file ? 'border-solid border-[#1FC79B]/30 bg-white' : ''}`}
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                className="hidden" 
                                accept=".pdf,.doc,.docx" 
                                onChange={handleFileChange}
                            />
                            
                            <div className={`flex flex-col items-center justify-center gap-4 pointer-events-none z-10 transition-all duration-300 ${file ? 'opacity-0 scale-95' : ''}`}>
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-[32px]">upload_file</span>
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-slate-700 mb-1">Drag & Drop file here</p>
                                    <p className="text-sm text-slate-400">PDF or DOCX up to 2MB</p>
                                </div>
                            </div>

                            {/* File Chip */}
                            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500 z-10 ${file ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95'}`}>
                                <div className="flex flex-col items-center gap-4 p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-[24px]">description</span>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <span className="font-medium text-slate-800 truncate w-48">{file?.name}</span>
                                        <span className="text-sm text-[#1FC79B] font-medium">Ready for analysis</span>
                                    </div>
                                    <button 
                                        className="mt-2 text-slate-400 hover:text-red-500 transition-colors pointer-events-auto text-sm font-medium flex items-center gap-1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                            if (fileInputRef.current) fileInputRef.current.value = "";
                                        }}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">close</span> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Job Description */}
                    <div className="flex flex-col gap-4">
                        <div className="font-semibold text-sm text-slate-500 uppercase tracking-wider flex justify-between items-end">
                            <span>2. Target Job Description</span>
                            <span className={`text-xs ${jd.length > 0 ? 'text-slate-400' : 'text-slate-400 opacity-0'}`}>{jd.length} / 5000</span>
                        </div>
                        
                        {/* Job Role Presets */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-slate-700">Or select a job role to auto-fill JD</label>
                            <select 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-[#1FC79B] transition-colors cursor-pointer appearance-none"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setJd(e.target.value);
                                    }
                                }}
                                defaultValue=""
                            >
                                <option value="" disabled>Select a role...</option>
                                <option value="We are looking for a Software Engineer with experience in Python, JavaScript, REST APIs, system design, microservices, Docker, Kubernetes, CI/CD pipelines, Git, SQL, PostgreSQL, AWS or GCP, unit testing, agile methodology, code review, data structures, algorithms, scalability, debugging.">Software Engineer</option>
                                <option value="Seeking a Frontend Developer skilled in React, Next.js, TypeScript, Tailwind CSS, HTML5, CSS3, responsive design, web performance optimization, accessibility, REST APIs, state management, Redux, Framer Motion, animations, cross-browser compatibility, Git, Figma, UI/UX principles.">Frontend Developer</option>
                                <option value="Looking for a Backend Developer with Node.js, Python, FastAPI, Django, REST APIs, GraphQL, PostgreSQL, MongoDB, Redis, Docker, microservices architecture, authentication, JWT, OAuth, system design, AWS, CI/CD, message queues, Kafka, performance optimization, database indexing.">Backend Developer</option>
                                <option value="Hiring Full Stack Developer with React, Next.js, Node.js, Python, FastAPI, PostgreSQL, MongoDB, Redis, Docker, Kubernetes, REST APIs, TypeScript, Git, CI/CD, AWS, Tailwind CSS, system design, authentication, deployment, microservices, agile, code review.">Full Stack Developer</option>
                                <option value="Seeking Data Scientist with Python, machine learning, TensorFlow, PyTorch, scikit-learn, pandas, NumPy, data visualization, Matplotlib, Seaborn, SQL, feature engineering, model deployment, NLP, deep learning, statistics, A/B testing, Jupyter, MLOps, data pipelines, AWS SageMaker.">Data Scientist</option>
                                <option value="Looking for DevOps Engineer with Docker, Kubernetes, CI/CD pipelines, Jenkins, GitHub Actions, Terraform, Ansible, AWS, GCP, Azure, Linux, bash scripting, monitoring, Prometheus, Grafana, ELK stack, infrastructure as code, networking, security, service mesh, Helm charts.">DevOps Engineer</option>
                                <option value="Hiring Product Manager with product roadmap planning, user research, agile methodology, Jira, stakeholder management, data analysis, SQL, A/B testing, go-to-market strategy, PRD writing, prioritization, user stories, OKRs, KPIs, cross-functional collaboration, wireframing, Figma, market research.">Product Manager</option>
                                <option value="Seeking UI/UX Designer with Figma, Adobe XD, user research, wireframing, prototyping, design systems, usability testing, accessibility, responsive design, interaction design, information architecture, user journey mapping, Sketch, component libraries, visual design, typography, color theory.">UI/UX Designer</option>
                            </select>
                            <span className="text-xs text-[#1FC79B] font-medium">Quick start without a real JD</span>
                        </div>

                        <div className="relative h-[200px]">
                            <textarea 
                                value={jd}
                                onChange={(e) => setJd(e.target.value.substring(0, 5000))}
                                className="w-full h-full resize-none bg-slate-50 border border-slate-200 rounded-xl p-5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#1FC79B] focus:bg-white transition-all shadow-inner custom-scrollbar" 
                                placeholder="Paste the target job description here..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-center mt-2">
                    <button 
                        onClick={handleAnalyze}
                        className="bg-[#1FC79B] text-white font-semibold text-lg px-12 py-4 rounded-xl hover:bg-[#18a982] hover:-translate-y-1 transition-all shadow-md flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">document_scanner</span>
                        Check Resume
                    </button>
                </div>
            </div>

            {/* Analyzing State Overlay - Enhancv Style Scanner */}
            <AnimatePresence>
                {isAnalyzing && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-30"
                    >
                        <div className="w-full max-w-sm px-8 flex flex-col items-center gap-8">
                            
                            {/* Document Scanner Graphic */}
                            <div className="relative w-40 h-48 bg-slate-100 rounded-lg border-2 border-slate-200 overflow-hidden shadow-inner flex flex-col items-center pt-8">
                                {/* Fake text lines */}
                                <div className="w-24 h-2 bg-slate-300 rounded mb-4"></div>
                                <div className="w-32 h-2 bg-slate-200 rounded mb-2"></div>
                                <div className="w-28 h-2 bg-slate-200 rounded mb-2"></div>
                                <div className="w-32 h-2 bg-slate-200 rounded mb-6"></div>
                                <div className="w-20 h-2 bg-slate-300 rounded mb-2"></div>
                                <div className="w-28 h-2 bg-slate-200 rounded mb-2"></div>

                                {/* Laser Scan Line */}
                                <motion.div 
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 w-full h-1 bg-[#FFB86F] shadow-[0_0_10px_#FFB86F] z-10"
                                />
                                {/* Laser overlay highlight */}
                                <motion.div 
                                    animate={{ top: ['-20%', '80%', '-20%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 w-full h-[20%] bg-gradient-to-b from-transparent to-[#FFB86F]/20 z-0"
                                />
                            </div>

                            <div className="text-center w-full">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{statusMsg}</h3>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-4">
                                    <motion.div 
                                        className="h-full bg-primary rounded-full" 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </div>
                                <p className="text-sm font-medium text-primary mt-2">{Math.floor(progress)}%</p>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
