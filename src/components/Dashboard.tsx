import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { User } from 'firebase/auth';
import { dbService } from '../services/db';

interface DashboardProps {
  user: User;
  setScreen: (s: any) => void;
}

export function Dashboard({ user, setScreen }: DashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await dbService.getDashboardStats(user.uid);
      setStats(data);
      setLoading(false);
    }
    load();
  }, [user.uid]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-light mb-2 text-white">
          Welcome back, <span className="font-semibold">{user.displayName?.split(' ')[0] || 'Educator'}</span>
        </h1>
        <p className="text-white/40 text-sm font-medium tracking-wide leading-none">
          Here is your overview for the current academic term.
        </p>
      </header>

      {/* Metrics Row */}
      <div className="flex flex-wrap gap-6 mb-8">
        <MetricCard label="Enrollments" value={stats?.pendingEvaluations || 24} icon={History} trending />
        <MetricCard label="Graduated this week" value={stats?.gradedThisWeek || 156} icon={FileText} />
        <MetricCard label="Avg. Class Score" value={`${stats?.avgClassScore || 82}%`} icon={LayoutDashboard} secondaryValue="+2% vs LY" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Main Action Area */}
          <section className="glass rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-teal/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-accent-teal/10 transition-all" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="max-w-md">
                 <h2 className="text-2xl font-bold text-white mb-3">Initiate New Evaluation</h2>
                 <p className="text-white/50 text-sm leading-relaxed mb-6">
                   Upload student submissions and apply your rubrics using advanced AI analysis for instant, multi-dimensional feedback.
                 </p>
                 <button 
                   onClick={() => setScreen('upload')}
                   className="px-8 py-4 bg-accent-teal text-black font-bold rounded-xl shadow-lg shadow-accent-teal/20 hover:scale-105 active:scale-95 transition-all text-[10px] uppercase tracking-[0.3em] inline-flex items-center gap-3"
                 >
                   <Plus size={16} />
                   Start Upload Process
                 </button>
               </div>
               <div className="w-48 h-48 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center rotate-3 group-hover:rotate-6 transition-transform shadow-2xl relative">
                  <div className="absolute inset-0 bg-accent-teal/10 animate-pulse rounded-3xl" />
                  <Plus size={48} className="text-accent-teal opacity-50 relative z-10" />
               </div>
            </div>
          </section>

          {/* Activity Feed */}
          <section className="glass rounded-2xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 serif">Recent Evaluations</h3>
              <button className="text-[10px] font-bold text-accent-teal hover:underline tracking-widest uppercase">View Archive</button>
            </div>
            <div className="space-y-3">
              <AssignmentCard status="Needs Review" title="Midterm Exam: World History" subtitle="Grade 10 – Midterm 101" time="01:14 PM" />
              <AssignmentCard status="Processing" title="Building a Lab Report" subtitle="Grade 12 – Advanced Math" progress={65} />
              <AssignmentCard status="Completed" title="Biology Lab Report" subtitle="Grade 11 – Science Lab" score={85} />
            </div>
          </section>
        </div>

        <aside className="space-y-8">
           {/* Sidebar Component: Features */}
           <section className="glass rounded-2xl p-8 flex flex-col gap-8 h-full">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6 serif">Performance Breakdown</h3>
                <div className="space-y-6">
                   <ProgressItem label="Q1 Cell Structure" val={100} right="5/5" />
                   <ProgressItem label="Q2 Genetics" val={60} right="3/5" />
                   <ProgressItem label="Q3 Evolution" val={20} right="2/10" color="bg-red-400" />
                   <ProgressItem label="Q4 Ecology" val={20} right="2/10" color="bg-red-400" />
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6 sans">Cohort Analytics</h3>
                <div className="space-y-4">
                  <CohortRow label="Fall 2023 Cohort" val="76%" />
                  <CohortRow label="Summer 2023 Cohort" val="74%" />
                  <CohortRow label="Spring 2023 Cohort" val="80%" />
                </div>
              </div>

              <div className="mt-auto">
                 <div className="p-5 rounded-2xl bg-accent-teal/10 border border-accent-teal/20 text-center">
                    <p className="text-[10px] font-black text-accent-teal uppercase tracking-[0.2em] mb-1">AI Grading Active</p>
                    <p className="text-[10px] text-white/40 font-medium">Processing World History Batch...</p>
                 </div>
              </div>
           </section>
        </aside>
      </div>
    </div>
  );
}

function MetricCard({ label, value, trending, secondaryValue }: any) {
  return (
    <div className="glass p-8 rounded-2xl flex-1 min-w-[200px] border border-white/10 relative overflow-hidden group">
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent-teal/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
      <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30 mb-3 relative z-10">{label}</p>
      <div className="flex items-end gap-3 relative z-10">
        <span className="text-5xl font-light text-white tracking-tighter">{value}</span>
        {trending && <span className="text-[10px] font-bold text-green-400 mb-2 uppercase tracking-widest">↑ Trending</span>}
        {secondaryValue && <span className="text-[10px] font-bold text-white/20 mb-2 uppercase tracking-widest leading-none">{secondaryValue}</span>}
      </div>
    </div>
  );
}

function AssignmentCard({ status, title, subtitle, time, progress, score }: any) {
  return (
    <div className="p-4 border border-white/5 bg-white/2 rounded-xl flex justify-between items-center transition-all group hover:bg-white/5 active:scale-[0.99] cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-2 h-2 rounded-full",
          status === 'Processing' ? "bg-accent-teal shadow-lg shadow-accent-teal/50 animate-pulse" : 
          status === 'Needs Review' ? "bg-amber-400" : "bg-white/10"
        )} />
        <div>
          <p className="text-sm font-bold text-white group-hover:text-accent-teal transition-colors">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{subtitle}</p>
            {score && <span className="text-[10px] text-accent-teal font-black">Score: {score}</span>}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        {time && <span className="text-[10px] font-mono font-bold px-3 py-1.5 glass rounded-lg text-white/50">{time}</span>}
        {progress !== undefined && (
          <div className="flex items-center gap-3 w-24">
             <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent-teal transition-all duration-1000" style={{ width: `${progress}%` }} />
             </div>
             <span className="text-[9px] font-bold text-white/40">{progress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressItem({ label, val, right, color = "bg-accent-teal" }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-bold tracking-[0.2em] uppercase text-white/30">
         <span>{label}</span>
         <span className="font-mono text-white/50">{right}</span>
      </div>
      <div className="progress-bar">
         <div className={cn("progress-fill", color)} style={{ width: `${val}%` }} />
      </div>
    </div>
  );
}

function CohortRow({ label, val }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[11px] font-semibold text-white/50">{label}</span>
      <span className="text-xs font-black text-accent-teal tracking-widest uppercase">{val}</span>
    </div>
  );
}
