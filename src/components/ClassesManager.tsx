import React, { useState, useEffect } from 'react';
import { Plus, Settings, Users, ArrowRight, MoreVertical, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { User } from 'firebase/auth';
import { dbService } from '../services/db';

export function ClassesManager({ user }: { user: User }) {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRoster, setShowRoster] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await dbService.getClasses(user.uid);
      setClasses(data || []);
      setLoading(false);
    }
    load();
  }, [user.uid]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
       <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-accent-teal border-t-transparent rounded-full mb-4 opacity-50"
       />
       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 serif">Hydrating Schemas</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-light text-white tracking-tighter mb-1">Academic <span className="font-bold italic">Cohorts</span></h2>
          <p className="text-white/40 text-sm font-medium tracking-wide">Orchestrate student rosters, structural grading scales, and rubric assets.</p>
        </div>
        <button className="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-accent-teal transition-all shadow-xl active:scale-95">
          <Plus size={18} className="opacity-50" />
          Initialize New Batch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {classes.length === 0 ? (
          <>
            <ClassCard 
              title="Grade 10 - World History" 
              section="Section A" 
              term="Fall 2023" 
              students={28} 
              assignments={12} 
              grade="B+" 
              onRoster={() => setShowRoster("Grade 10 - World History")}
            />
            <ClassCard 
              title="AP European History" 
              section="Section B" 
              term="Fall 2023" 
              students={15} 
              assignments={4} 
              grade="A-" 
              onRoster={() => setShowRoster("AP European History")}
            />
          </>
        ) : (
          classes.map(c => (
            <ClassCard 
              key={c.id} 
              title={c.name} 
              section={c.section} 
              term={c.term} 
              students={c.studentCount || 0} 
              assignments={c.assignmentCount || 0} 
              grade={c.avgGrade || "N/A"} 
              onRoster={() => setShowRoster(c.name)}
            />
          ))
        )}
      </div>

      <div className="glass p-10 rounded-[2.5rem] bg-surface-dark/40 shadow-2xl border border-white/5">
        <div className="flex items-center gap-4 mb-10">
           <div className="w-12 h-12 bg-white/5 text-accent-teal rounded-2xl flex items-center justify-center shadow-inner">
             <Settings size={20} className="opacity-50" />
           </div>
           <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white serif">Global Overrides</h3>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-0.5">Configuration Presets</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="space-y-6">
              <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] block pl-4">Calculus Schema</label>
              <div className="relative group">
                <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-black text-[10px] uppercase tracking-widest text-white/60 focus:ring-1 focus:ring-accent-teal/50 focus:border-accent-teal/50 appearance-none transition-all hover:bg-white/10">
                  <option className="bg-surface-dark">Standard Letter (A-F)</option>
                  <option className="bg-surface-dark">Percentage (0-100)</option>
                  <option className="bg-surface-dark">Grade Point (0.0-4.0)</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-accent-teal/30 group-hover:text-accent-teal transition-colors">
                   <ArrowRight size={14} className="rotate-90" />
                </div>
              </div>
              <div className="flex items-center gap-3 pl-4">
                 <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Normal Distribution Range:</span>
                 <input className="w-20 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-center font-black text-[10px] uppercase text-accent-teal" defaultValue="70-80" />
              </div>
           </div>

           <div className="space-y-6">
              <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] block pl-4">Rubric Artifacts</label>
              <div className="group relative glass p-6 rounded-2xl border border-white/5 hover:border-accent-teal/30 hover:bg-white/2 transition-all cursor-pointer">
                 <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white group-hover:text-accent-teal transition-colors uppercase tracking-tight text-sm">Historical Essay V2</h4>
                    <MoreVertical size={16} className="text-white/10" />
                 </div>
                 <p className="text-[10px] text-white/20 font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent-teal/40" />
                    20 Pts • Advanced Feedback Engaged
                 </p>
                 <ArrowRight size={20} className="absolute right-6 bottom-6 text-accent-teal opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100" />
              </div>
              <button className="flex items-center gap-3 text-white/30 font-black text-[9px] uppercase tracking-widest hover:text-white transition-all pl-4 group">
                <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center group-hover:rotate-90 transition-transform">
                  <Plus size={12} />
                </div>
                Forge New Rubric
              </button>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {showRoster && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setShowRoster(null)}
               className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 40 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 40 }}
               className="w-full max-w-2xl glass rounded-[3rem] shadow-3xl p-12 relative z-10 overflow-hidden border border-white/10"
            >
               <div className="mb-10 text-center">
                  <h3 className="text-3xl font-light text-white tracking-tighter uppercase mb-1">{showRoster} <span className="font-bold italic">Manifest</span></h3>
                  <p className="text-white/20 text-[10px] uppercase font-black tracking-[0.3em]">Authorized Access Only • Neural Scan Active</p>
               </div>
               
               <div className="max-h-[450px] overflow-y-auto pr-4 space-y-4 custom-scrollbar">
                  {[
                    { name: "Sarah Jenkins", roll: "CS-2023-01" },
                    { name: "Marcus Johnson", roll: "CS-2023-02" },
                    { name: "Sophia Chen", roll: "CS-2023-03" },
                    { name: "Emily Davis", roll: "CS-2023-04" },
                    { name: "John Smith", roll: "CS-2023-05" }
                  ].map((s, i) => (
                    <RosterRow key={i} name={s.name} roll={s.roll} />
                  ))}
               </div>

               <button 
                 onClick={() => setShowRoster(null)}
                 className="mt-12 w-full py-5 bg-white/5 text-white/40 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-white/10 hover:text-white transition-all border border-white/5"
               >
                 Terminate Session
               </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ClassCard({ title, section, term, students, assignments, grade, onRoster }: any) {
  return (
    <div className="glass p-8 rounded-[2.5rem] hover:bg-white/5 transition-all group relative overflow-hidden shadow-2xl border border-white/5">
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/2 rounded-bl-full -mr-24 -mt-24 transition-all group-hover:scale-125 duration-700" />
      
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div>
          <h3 className="text-2xl font-light text-white group-hover:text-accent-teal transition-colors tracking-tighter uppercase mb-1">{title}</h3>
          <p className="text-white/30 font-bold text-[10px] uppercase tracking-widest">{section} • <span className="italic opacity-60">{term}</span></p>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 glass border border-white/5 text-white/20 rounded-xl flex items-center justify-center hover:text-white transition-all hover:bg-white/5"><Edit2 size={16} /></button>
          <button className="w-10 h-10 glass border border-white/5 text-white/20 rounded-xl flex items-center justify-center hover:text-white transition-all hover:bg-white/5"><MoreVertical size={16} /></button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 relative z-10 mb-10">
        <div className="text-center p-4 bg-white/2 rounded-2xl border border-white/5">
          <p className="text-3xl font-light text-white tracking-tighter">{students}</p>
          <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.2em] mt-1">Students</p>
        </div>
        <div className="text-center p-4 bg-white/2 rounded-2xl border border-white/5">
          <p className="text-3xl font-light text-white tracking-tighter">{assignments}</p>
          <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.2em] mt-1">Artifacts</p>
        </div>
        <div className="text-center p-4 bg-accent-teal/5 rounded-2xl border border-accent-teal/10">
          <p className="text-3xl font-black text-accent-teal tracking-tighter">{grade}</p>
          <p className="text-[10px] font-black text-accent-teal uppercase tracking-[0.2em] mt-1 opacity-40">Cohort GPA</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-8 relative z-10">
         <div className="flex -space-x-3">
            {[1,2,3].map(i => (
              <div key={i} className="w-12 h-12 rounded-2xl border border-surface-dark-light bg-black overflow-hidden ring-4 ring-transparent group-hover:ring-accent-teal/10 transition-all shadow-inner">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=st${i}`} alt="student" className="opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
            <div className="w-12 h-12 rounded-2xl border border-white/5 bg-white/5 text-white/40 flex items-center justify-center text-[10px] font-black uppercase tracking-tighter shadow-xl">+25</div>
         </div>
         <button 
           onClick={onRoster}
           className="text-[10px] font-black text-accent-teal uppercase tracking-[0.2em] hover:text-white transition-all flex items-center gap-3 active:scale-95 group/btn"
         >
           Access Roster
           <div className="w-8 h-8 rounded-xl glass border border-accent-teal/20 flex items-center justify-center group-hover/btn:bg-accent-teal group-hover/btn:text-black transition-all">
             <ArrowRight size={14} />
           </div>
         </button>
      </div>
    </div>
  );
}

function RosterRow({ name, roll }: any) {
  return (
    <div className="flex items-center justify-between p-6 glass rounded-[2rem] border border-white/5 hover:border-accent-teal/30 hover:bg-white/2 transition-all group overflow-hidden relative">
      <div className="absolute inset-0 bg-accent-teal/0 group-hover:bg-accent-teal/[0.02] transition-colors" />
      <div className="flex items-center gap-6 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-accent-teal group-hover:bg-accent-teal group-hover:text-black transition-all uppercase text-sm serif">
          {name.charAt(0)}
        </div>
        <div>
           <p className="font-bold text-white group-hover:text-accent-teal transition-colors tracking-tight">{name}</p>
           <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-0.5">Primary Enrolment Active</p>
        </div>
      </div>
      <p className="text-[10px] font-black text-white/20 bg-white/2 px-4 py-2 rounded-xl border border-white/5 relative z-10 group-hover:text-white transition-colors uppercase tracking-[0.2em]">#{roll}</p>
    </div>
  );
}
