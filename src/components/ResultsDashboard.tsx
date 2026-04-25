import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Download, 
  FileText, 
  ChevronRight, 
  TrendingUp, 
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const trendData = [
  { name: 'Week 1', score: 65 },
  { name: 'Week 2', score: 72 },
  { name: 'Week 3', score: 68 },
  { name: 'Week 4', score: 82 },
  { name: 'Week 5', score: 78 },
  { name: 'Week 6', score: 85 },
];

export function ResultsDashboard({ user }: any) {
  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-light text-white tracking-tighter mb-1">Class <span className="font-bold italic">Results</span></h2>
          <p className="text-white/40 font-medium tracking-wide text-sm flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-accent-teal" />
            Midterm Examination — Fall 2023 Academic Term
          </p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-3 px-6 py-3 glass rounded-xl font-black text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-all">
             <Download size={16} className="mb-0.5" />
             CSV Data
          </button>
          <button className="flex items-center gap-3 px-8 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-accent-teal transition-all shadow-xl shadow-accent-teal/5">
             <FileText size={16} className="mb-0.5 opacity-50" />
             Export Narrative Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard label="Aggregate Mean" value="78" max="/100" color="bg-accent-teal" />
        <StatsCard label="Maximum Achievement" value="96" max="/100" color="bg-emerald-400" />
        <StatsCard label="Metric Minimum" value="42" max="/100" color="bg-red-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Performance Trend Chart */}
        <div className="glass p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 serif">Performance Lifecycle</h3>
              <p className="text-[10px] text-accent-teal font-black uppercase tracking-[0.2em] mt-1 opacity-60">Real-time Volatility Index</p>
            </div>
            <TrendingUp size={24} className="text-accent-teal/20 group-hover:text-accent-teal transition-colors" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4FD1C5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4FD1C5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9, fontWeight: 900 }}
                  dy={10}
                />
                <YAxis 
                   hide 
                   domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A0A', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ color: '#4FD1C5', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#4FD1C5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  dot={{ r: 4, fill: '#0A0A0A', strokeWidth: 2, stroke: '#4FD1C5' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#4FD1C5' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Analytics Breakdown */}
        <div className="glass p-10 rounded-[2.5rem] flex flex-col gap-8 h-full bg-surface-dark/40 shadow-2xl">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 serif">Vectorized Subject Analytics</h3>
          <div className="flex-1 space-y-8">
            <div className="grid grid-cols-2 gap-6">
               <QuestionProgress label="Q1 Cell Structure" score={5} max={5} />
               <QuestionProgress label="Q2 Genetics" score={3} max={5} />
               <QuestionProgress label="Q3 Evolution" score={2} max={10} />
               <QuestionProgress label="Q4 Ecology" score={2} max={10} />
            </div>
            
            <div className="pt-8 border-t border-white/5 space-y-6">
               <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Historical Cohort Comparisons</p>
               <div className="space-y-5">
                  <ComparisonRow label="Fall 2023 Cohort" value={76} />
                  <ComparisonRow label="Summer 2023 Cohort" value={74} />
                  <ComparisonRow label="Spring 2023 Cohort" value={80} />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Evaluations Table */}
      <div className="glass rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5">
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/2">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 serif">Evaluation Archive</h3>
           <button className="text-[10px] font-black text-accent-teal hover:underline tracking-widest uppercase">Global Audit</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-transparent border-b border-white/5">
                <th className="p-6 text-[9px] font-black text-white/20 uppercase tracking-[0.2em] italic">Session Header</th>
                <th className="p-6 text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Context Schema</th>
                <th className="p-6 text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Telemetry</th>
                <th className="p-6 text-[9px] font-black text-white/20 uppercase tracking-[0.2em] text-right italic">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/2">
              <EvalRow 
                name="Midterm Exams – AP English" 
                meta="Sarah Jenkins • Grade 10 Honors" 
                status="completed" 
              />
              <EvalRow 
                name="Pop Quiz – Algebra II" 
                meta="Sarah Jenkins • Section B" 
                status="processing" 
              />
              <EvalRow 
                name="Lab Reports – Chemistry 101" 
                meta="Sarah Jenkins • Lab Group Delta" 
                status="review" 
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, max, color }: any) {
  return (
    <div className="glass p-10 rounded-[2.5rem] relative overflow-hidden group shadow-2xl hover:bg-white/5 transition-all">
      <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-16 -mt-16 opacity-5 bg-white")} />
      <p className="text-white/20 font-black uppercase tracking-[0.2em] text-[10px] mb-2 serif italic">Attribute Statistics</p>
      <h4 className="text-white/60 font-bold text-sm tracking-wide mb-6 uppercase tracking-wider">{label}</h4>
      <div className="flex items-baseline gap-2">
         <span className={cn("text-7xl font-light tabular-nums transition-transform group-hover:scale-105 inline-block text-white")}>{value}</span>
         <span className="text-white/10 font-bold text-2xl">{max}</span>
      </div>
      <div className={cn("absolute bottom-0 left-0 h-1 transition-all group-hover:h-2", color)} style={{ width: '100%' }} />
    </div>
  );
}

function QuestionProgress({ label, score, max }: any) {
  const percent = (score / max) * 100;
  return (
    <div className="bg-white/2 p-6 rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
      <p className="text-[9px] font-black text-white/30 mb-3 uppercase tracking-widest truncate">{label}</p>
      <div className="flex items-center justify-between mb-4">
         <span className="text-2xl font-light text-white tracking-tighter">{score}<span className="text-white/10 text-base">/{max}</span></span>
         <span className={cn("text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest", percent >= 70 ? "bg-accent-teal/10 text-accent-teal" : "bg-red-400/10 text-red-400")}>
           {percent}%
         </span>
      </div>
      <div className="progress-bar">
         <div className={cn("progress-fill", percent >= 70 ? "bg-accent-teal" : "bg-red-400")} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function ComparisonRow({ label, value }: any) {
  return (
    <div className="flex items-center gap-6 group">
      <span className="text-[11px] font-bold text-white/40 w-32 truncate group-hover:text-white transition-colors">{label}</span>
      <div className="flex-1 progress-bar h-1">
        <div className="progress-fill opacity-40 group-hover:opacity-100" style={{ width: `${value}%` }} />
      </div>
      <span className="text-[11px] font-black text-white tabular-nums tracking-widest">{value}%</span>
    </div>
  );
}

function EvalRow({ name, meta, status }: any) {
  return (
    <tr className="group hover:bg-white/2 transition-all cursor-pointer">
      <td className="p-6">
        <p className="font-bold text-white group-hover:text-accent-teal transition-colors tracking-tight">{name}</p>
      </td>
      <td className="p-6">
        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-none">{meta}</p>
      </td>
      <td className="p-6">
        <span className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border",
          status === 'completed' ? "bg-accent-teal/5 text-accent-teal border-accent-teal/20" :
          status === 'processing' ? "bg-white/5 text-white/40 border-white/10" :
          "bg-amber-400/5 text-amber-400 border-amber-400/20"
        )}>
          {status === 'completed' && <CheckCircle2 size={12} />}
          {status === 'processing' && <Clock size={12} className="animate-spin" />}
          {status === 'review' && <AlertTriangle size={12} />}
          {status}
        </span>
      </td>
      <td className="p-6 text-right">
        <button className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-accent-teal transition-all flex items-center gap-3 ml-auto active:scale-95">
          Access Data
          <div className="w-6 h-6 rounded-full glass flex items-center justify-center">
            <ChevronRight size={14} />
          </div>
        </button>
      </td>
    </tr>
  );
}
