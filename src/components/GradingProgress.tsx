import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ScanLine, 
  CheckCircle, 
  RefreshCw, 
  FileIcon,
} from 'lucide-react';
import { cn } from '../lib/utils';

export function GradingProgress({ onCancel, onComplete }: any) {
  const [progress, setProgress] = useState(0);
  const [currentBatch, setCurrentBatch] = useState(0);
  const totalBatches = 20;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1000); // Auto-complete shortly after 100%
          return 100;
        }
        const jump = Math.floor(Math.random() * 8) + 2;
        return Math.min(prev + jump, 100);
      });
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    setCurrentBatch(Math.floor((progress / 100) * totalBatches));
  }, [progress]);

  const students = [
    { name: "Emma Thompson", sub: "Biology Midterm - AP" },
    { name: "Marcus Johnson", sub: "Biology Midterm - AP" },
    { name: "Sophia Chen", sub: "Biology Midterm - AP" },
    { name: "John Smith", sub: "Biology Midterm - AP" },
    { name: "Alice Weaver", sub: "Biology Midterm - AP" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl glass rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        {/* Header & Primary Status */}
        <div className="p-12 border-b border-white/5 bg-gradient-to-b from-white/2 to-transparent">
          <div className="flex items-start justify-between mb-10">
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-accent-teal">
                <ScanLine size={32} className="animate-pulse" />
                <h1 className="text-3xl font-light tracking-tighter text-white">Evaluating <span className="font-bold italic">Papers</span></h1>
              </div>
              <p className="text-white/40 font-medium tracking-wide text-sm">Applying neural grading rubrics and extracting granular feedback...</p>
            </div>
            <div className="text-right">
              <span className="text-7xl font-black text-white tracking-tighter opacity-80">{progress}<span className="text-2xl text-accent-teal ml-1">%</span></span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="progress-bar h-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="progress-fill"
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
              <span>Estimated time: {Math.max(0, 120 - Math.floor((progress/100) * 120))}s</span>
              <span className="text-accent-teal/60">Batch {currentBatch} of {totalBatches} Processed</span>
            </div>
          </div>
        </div>

        {/* Queue Section */}
        <div className="p-8 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
           {students.map((s, i) => {
             const studentProgress = (progress / 100) * totalBatches;
             const isGraded = i < Math.floor(studentProgress / 4);
             const isAnalyzing = !isGraded && i === Math.floor(studentProgress / 4);
             
             return (
               <StatusRow 
                  key={i} 
                  name={s.name} 
                  sub={s.sub} 
                  status={isGraded ? "Graded" : isAnalyzing ? "Analyzing" : "Pending"} 
                  active={isAnalyzing} 
               />
             );
           })}
        </div>

        {/* Actions */}
        <div className="p-8 border-t border-white/5 flex justify-center gap-6">
           <button 
             onClick={onCancel}
             className="px-8 py-3 rounded-xl border border-white/5 text-white/40 font-bold uppercase tracking-widest text-[10px] hover:bg-red-500/10 hover:text-red-400 transition-all font-black"
           >
             Terminate Session
           </button>
           {progress === 100 && (
             <button 
               onClick={onComplete}
               className="px-10 py-3 rounded-xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-accent-teal hover:text-black transition-all shadow-xl shadow-accent-teal/5 animate-bounce"
             >
               Access Preview
             </button>
           )}
        </div>
      </motion.div>
    </div>
  );
}

function StatusRow({ name, sub, status, active }: any) {
  return (
     <div className={cn(
       "flex items-center gap-5 p-5 rounded-2xl border transition-all",
       active ? "bg-white/5 border-white/10 ring-1 ring-accent-teal/20" : "bg-transparent border-white/5 opacity-40"
     )}>
        <div className="w-12 h-14 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden shrink-0 border border-white/5">
           <FileIcon size={24} className="text-white/20" />
        </div>
        <div className="flex-1 min-w-0">
           <h3 className="font-bold text-white truncate">{name}</h3>
           <p className="text-[10px] text-white/30 font-bold truncate uppercase tracking-widest mt-1">{sub}</p>
        </div>
        <div className="flex flex-col items-end shrink-0">
           {status === 'Graded' && <CheckCircle size={20} className="text-emerald-400" />}
           {status === 'Analyzing' && <RefreshCw size={20} className="text-accent-teal animate-spin" />}
           {status === 'Pending' && <ClockIcon size={20} className="text-white/10" />}
           <span className={cn(
             "text-[9px] font-black uppercase mt-2 tracking-widest",
             status === 'Graded' ? "text-emerald-400" : status === 'Analyzing' ? "text-accent-teal" : "text-white/10"
           )}>{status}</span>
        </div>
     </div>
  );
}

function ClockIcon({ size, className }: any) {
  return (
    <div className={cn("rounded-full border-2 border-current flex items-center justify-center relative", className)} style={{ width: size, height: size }}>
       <div className="w-0.5 h-2 bg-current rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full origin-bottom" />
       <div className="w-1.5 h-0.5 bg-current rounded-full absolute top-1/2 left-1/2 -translate-y-1/2 rotate-45 origin-left" />
    </div>
  );
}
