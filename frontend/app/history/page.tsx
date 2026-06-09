"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

type ScanRecord = {
  id: number;
  filename: string;
  ats_score: number;
  created_at: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiUrl}/api/history`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch history:", err);
        setLoading(false);
      });
  };

  const getScoreColor = (score: number) => {
    if (score > 75) return "#1D9E75";
    if (score > 50) return "#F59E0B";
    return "#E24B4A";
  };

  const handleViewDetails = async (id: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/history/${id}`);
      
      if (!res.ok) {
          alert("Failed to fetch details from server.");
          return;
      }
      
      const data = await res.json();
      if (data.error || data.detail) {
        alert(data.error || data.detail || "Could not load details.");
        return;
      }
      
      localStorage.setItem("resumeResults", JSON.stringify(data));
      router.push("/results");
    } catch (e) {
      console.error(e);
      alert("Failed to connect to backend.");
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this scan?")) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/history/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchHistory();
      } else {
        alert("Failed to delete scan.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting scan.");
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="min-h-screen pt-32 pb-16 px-6 bg-[#F8FAFC]"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-10 text-slate-800">Scan History</h1>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-slate-100 shadow-sm h-24 animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50 text-slate-400" />
              <p>No scans found. Upload a resume to see history.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {history.map((scan, index) => (
                <motion.div
                  key={scan.id}
                  onClick={() => handleViewDetails(scan.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                  whileHover={{ scale: 1.02, backgroundColor: "#F8FAFC" }}
                  className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 group cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    {/* Mini Score Ring */}
                    <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                      <svg width="64" height="64" viewBox="0 0 100 100" className="transform -rotate-90">
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E2E8F0" strokeWidth="10" />
                        <circle
                          cx="50" cy="50" r="40" fill="transparent"
                          stroke={getScoreColor(scan.ats_score)}
                          strokeWidth="10"
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 - (scan.ats_score / 100) * 251.2}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute font-bold text-sm" style={{ color: getScoreColor(scan.ats_score) }}>
                        {scan.ats_score}
                      </span>
                    </div>

                    <div className="overflow-hidden">
                      <h3 className="font-semibold text-lg text-slate-800 truncate group-hover:text-[#1FC79B] transition-colors">
                        {scan.filename}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(scan.created_at).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-slate-100 ml-auto sm:ml-0">
                    <button className="text-slate-500 font-medium text-sm flex items-center gap-1 group-hover:text-[#1FC79B] transition-colors">
                      View Details
                      <span className="material-symbols-outlined text-[16px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, scan.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                      title="Delete Scan"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
