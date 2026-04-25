import React, { useState } from 'react';
import { Upload, ArrowRight, ArrowLeft, FileText, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { User } from 'firebase/auth';
import { GradingProgress } from './GradingProgress';

interface UploadWorkflowProps {
  user: User;
  onComplete: () => void;
}

export function UploadWorkflow({ user, onComplete }: UploadWorkflowProps) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [questionsFile, setQuestionsFile] = useState<File | null>(null);
  const [studentFiles, setStudentFiles] = useState<File[]>([]);

  const handleQuestionsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    // Simulate validation and processing
    setTimeout(() => {
      if (file.size > 20 * 1024 * 1024) {
        setError("Payload rejected: Semantic volume exceeds 20MB limit.");
        setIsUploading(false);
      } else {
        setQuestionsFile(file);
        setIsUploading(false);
        setStep(2);
      }
    }, 2000);
  };

  const handleStudentsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length > 50) {
      setError("Batch capacity exceeded: Max 50 artifacts per session.");
      return;
    }

    setStudentFiles(prev => [...prev, ...files]);
  };

  const nextStep = () => {
    if (step === 1 && !questionsFile) {
      setError("Input required: Please upload an assignment schema to proceed.");
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    if (step === 3) {
      if (studentFiles.length === 0) {
        setError("Input required: Please ingest student artifacts to initialize processing.");
        return;
      }
      setShowProgress(true);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (showProgress) {
    return <GradingProgress onCancel={() => setShowProgress(false)} onComplete={onComplete} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-red-500/10 border-l-4 border-red-500 text-red-200 rounded-r-xl flex items-center gap-4 shadow-2xl glass"
        >
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shrink-0 shadow-lg">
            <span className="text-white font-black text-sm">!</span>
          </div>
          <div>
            <p className="font-bold uppercase tracking-widest text-[10px] text-red-500 mb-0.5">Evaluation Error</p>
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="ml-auto text-white/20 hover:text-white transition-colors">
             <Plus size={24} className="rotate-45" />
          </button>
        </motion.div>
      )}

      <div className="glass p-10 rounded-[2.5rem] shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-8 border-b border-white/5 gap-6">
          <div>
            <h2 className="text-3xl font-light text-white tracking-tighter mb-1">New Grading <span className="font-bold italic">Session</span></h2>
            <p className="text-white/40 text-sm font-medium tracking-wide">Configure neural parameters before batch ingestion.</p>
          </div>
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all",
                  step === s ? "bg-accent-teal text-black shadow-lg shadow-accent-teal/20" : 
                  step > s ? "bg-white/10 text-accent-teal" : "bg-white/5 text-white/20 border border-white/5"
                )}>
                  {step > s ? "✓" : s}
                </div>
                {s < 3 && <div className={cn("w-6 h-0.5 mx-1 opacity-20", step > s ? "bg-accent-teal" : "bg-white/10")} />}
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-[450px] flex flex-col">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-2 serif text-center md:text-left">Vector Mapping</h3>
                <p className="text-sm text-white/60 mb-6 font-medium">Upload the original assignment prompt or exam paper to seed the AI model.</p>
              </div>
              
              <label className="block group">
                <div className={cn(
                  "border-2 border-dashed rounded-[2rem] p-20 text-center transition-all cursor-pointer",
                  isUploading ? "bg-white/5 border-accent-teal/50" : "border-white/5 hover:border-accent-teal/50 hover:bg-white/2"
                )}>
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-accent-teal border-t-transparent rounded-full mb-6"
                      />
                      <p className="font-black text-white uppercase tracking-[0.2em] text-xs">Analyzing Semantic Load...</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                         <Upload className="w-8 h-8 text-white/20 group-hover:text-accent-teal transition-colors" />
                      </div>
                      <p className="text-xl font-bold text-white mb-2">Drag & drop question paper</p>
                      <p className="text-[10px] uppercase font-black tracking-widest text-white/20">
                        {questionsFile ? `Active: ${questionsFile.name}` : "DOCX, PDF, JPG, PNG (Limit 20MB)"}
                      </p>
                      <button className="mt-10 px-10 py-4 bg-white/5 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">
                        {questionsFile ? "Change Vector" : "Local File System"}
                      </button>
                    </>
                  )}
                </div>
                <input type="file" className="hidden" onChange={handleQuestionsUpload} disabled={isUploading} />
              </label>

              <div className="p-6 bg-accent-teal/5 border border-accent-teal/10 rounded-2xl flex gap-4">
                 <div className="w-10 h-10 bg-accent-teal/10 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                   <Plus size={16} className="text-accent-teal" />
                 </div>
                 <p className="text-xs text-white/60 leading-relaxed">
                    <strong className="text-accent-teal uppercase tracking-widest text-[9px] block mb-1">Architecture Note</strong>
                    Semantic alignment improves drastically when the question paper includes detailed scoring intent or learning outcomes.
                 </p>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-2 serif">Grading Presets</h3>
                <p className="text-sm text-white/60 font-medium">Select a structural rubric for evaluation consistency.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-accent-teal/10 rounded-2xl border border-accent-teal/50 shadow-lg shadow-accent-teal/5 relative group cursor-pointer">
                   <div className="absolute top-4 right-4">
                      <div className="w-2 h-2 bg-accent-teal rounded-full shadow-[0_0_10px_#4FD1C5]" />
                   </div>
                   <h4 className="font-bold text-white mb-1 group-hover:text-accent-teal transition-colors">Historical Essay V2</h4>
                   <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">4 Criteria • 20 Pts • Letter (A-F)</p>
                </div>
                <button className="p-6 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white hover:border-white/20 hover:bg-white/2 transition-all flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center">
                    <Plus size={14} />
                  </div>
                  New Rubric Schema
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 text-center py-12">
              <div className="w-24 h-24 bg-accent-teal/10 ring-1 ring-accent-teal/30 text-accent-teal rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                 <FileText size={40} className="opacity-80" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-light text-white tracking-tighter uppercase">Payload <span className="font-bold italic">Manifest</span></h3>
                <p className="text-white/40 font-medium text-sm max-w-sm mx-auto leading-relaxed">
                  Batch target: <span className="text-white uppercase font-black text-[10px] tracking-widest">Grade 10 - World History</span>. 
                </p>
              </div>
              
              <div className="mt-12 group">
                <label className="block cursor-pointer">
                  <div className="glass border border-white/10 rounded-[2rem] p-16 hover:border-accent-teal/30 transition-all relative overflow-hidden">
                    <div className="absolute inset-0 bg-accent-teal/0 group-hover:bg-accent-teal/2 transition-colors duration-500" />
                    <Plus size={32} className="mx-auto text-white/10 group-hover:text-accent-teal transition-all group-hover:scale-110 mb-6 relative z-10" />
                    <p className="font-black text-white uppercase tracking-[0.2em] text-xs relative z-10">
                      {studentFiles.length > 0 ? `${studentFiles.length} Artifacts Prepared` : "Ingest Student Artifacts"}
                    </p>
                    <p className="text-[9px] text-white/20 font-bold tracking-widest uppercase mt-2 relative z-10">
                      {studentFiles.length > 0 ? "Click to add more" : "50 Submissions Max per Session"}
                    </p>
                  </div>
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    onChange={handleStudentsUpload} 
                  />
                </label>
              </div>

              {studentFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {studentFiles.slice(0, 4).map((f, i) => (
                    <div key={i} className="bg-white/5 p-2 rounded-lg border border-white/5 text-[9px] text-white/40 truncate">
                      {f.name}
                    </div>
                  ))}
                  {studentFiles.length > 4 && (
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5 text-[9px] text-accent-teal font-bold uppercase">
                      +{studentFiles.length - 4} More
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          <div className="mt-auto pt-12 flex items-center justify-between">
            <button 
              onClick={prevStep}
              className={cn(
                "flex items-center gap-3 text-white/30 font-black uppercase tracking-[0.2em] text-[10px] hover:text-white transition-all",
                step === 1 && "invisible"
              )}
            >
              <ArrowLeft size={14} className="mb-0.5" />
              Return
            </button>
            <button 
              onClick={nextStep}
              className="bg-white text-black px-12 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-accent-teal transition-all flex items-center gap-4 shadow-2xl active:scale-95"
            >
              {step === 3 ? "Initialize Processing" : "Proceed"}
              <ArrowRight size={14} className="mb-0.5 text-black/40" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
