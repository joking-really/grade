import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  History, 
  Settings, 
  Users, 
  Menu,
  Bell,
  Search,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';

// Components
import { Dashboard } from './components/Dashboard';
import { UploadWorkflow } from './components/UploadWorkflow';
import { ClassesManager } from './components/ClassesManager';
import { ResultsDashboard } from './components/ResultsDashboard';

// Types
type Screen = 'dashboard' | 'upload' | 'results' | 'history' | 'classes' | 'settings';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = () => signInWithPopup(auth, new GoogleAuthProvider());
  const logout = () => signOut(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-dark p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass p-10 rounded-2xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-teal/5 rounded-bl-full -mr-16 -mt-16" />
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              <FileText className="text-accent-teal w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">PaperCheck Pro</h1>
            <p className="text-white/40 text-center mt-3 text-sm font-medium leading-relaxed">
              The AI-powered educator workspace for grading and analytics.
            </p>
          </div>
          
          <button 
            onClick={login}
            className="w-full py-4 bg-white text-black rounded-xl font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98]"
          >
             Sign in with Google
          </button>
          
          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Institutional Access Level 4</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const NavItem = ({ id, icon: Icon, label }: { id: Screen, icon: any, label: string }) => (
    <button
      onClick={() => setActiveScreen(id)}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all scale-95 active:scale-100 uppercase tracking-widest text-[10px] font-bold",
        activeScreen === id 
          ? "bg-white/5 text-white shadow-sm ring-1 ring-white/10" 
          : "text-white/40 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon size={16} className={cn(activeScreen === id ? "text-accent-teal" : "")} />
      {isSidebarOpen && <span>{label}</span>}
      {activeScreen === id && <motion.div layoutId="nav-pill" className="absolute right-2 w-1 h-4 bg-accent-teal rounded-full" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-surface-dark text-[#E0E0E0] flex">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col bg-surface-dark border-r border-white/5 p-6 transition-all duration-300 relative z-30",
        isSidebarOpen ? "w-72" : "w-24 items-center"
      )}>
        <div className={cn("flex items-center gap-3 mb-10 overflow-hidden", !isSidebarOpen && "justify-center")}>
          <div className="w-10 h-10 bg-accent-teal rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-accent-teal/20">
            <FileText className="text-black w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <div>
              <h2 className="font-black text-white truncate tracking-tighter text-lg">PaperCheck</h2>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Educator AI</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="upload" icon={Upload} label="Upload" />
          <NavItem id="results" icon={FileText} label="Results" />
          <NavItem id="history" icon={History} label="History" />
          <NavItem id="classes" icon={Users} label="Classes" />
          <NavItem id="settings" icon={Settings} label="Settings" />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
           <button 
             onClick={logout}
             className="w-full flex items-center gap-3 px-4 py-3 text-white/40 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest"
           >
             <LogOut size={16} />
             {isSidebarOpen && <span>Sign Out</span>}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-surface-dark border-b border-white/5 px-4 md:px-8 flex items-center justify-between shrink-0 relative z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg lg:flex hidden transition-colors"
            >
              <Menu size={20} className="text-white/40 hover:text-white" />
            </button>
            <h1 className="font-bold text-white capitalize hidden sm:block text-sm tracking-[0.1em] italic">{activeScreen}</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
              <input 
                placeholder="Search resources..."
                className="bg-white/5 border-none rounded-full pl-12 pr-6 py-2 text-[10px] font-bold tracking-widest uppercase text-white placeholder:text-white/20 w-72 focus:ring-1 focus:ring-accent-teal/50 transition-all outline-none"
              />
            </div>
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg relative transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent-teal rounded-full border-2 border-surface-dark"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest leading-none mb-1">Instructor</p>
                  <p className="text-xs font-semibold text-white leading-none truncate max-w-[120px]">{user.displayName || 'Sarah Jenkins'}</p>
                </div>
                <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 shadow-sm ring-2 ring-white/5">
                  <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="User" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-surface-dark/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
               {activeScreen === 'dashboard' && <Dashboard user={user} setScreen={setActiveScreen} />}
               {activeScreen === 'upload' && <UploadWorkflow user={user} onComplete={() => setActiveScreen('results')} />}
               {activeScreen === 'classes' && <ClassesManager user={user} />}
               {activeScreen === 'results' && <ResultsDashboard user={user} />}
               
               {['history', 'settings'].includes(activeScreen) && (
                 <div className="flex flex-col items-center justify-center p-20 text-white/10">
                    <LayoutDashboard size={64} className="mb-4 opacity-10" />
                    <p className="font-bold uppercase tracking-[0.3em] text-[10px]">Institutional Feature Pack Coming Soon</p>
                 </div>
               )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden h-16 bg-surface-dark border-t border-white/5 flex items-center justify-around px-2 shrink-0 relative z-30">
          <MobileNavItem id="dashboard" icon={LayoutDashboard} active={activeScreen === 'dashboard'} onClick={() => setActiveScreen('dashboard')} />
          <MobileNavItem id="upload" icon={Upload} active={activeScreen === 'upload'} onClick={() => setActiveScreen('upload')} />
          <MobileNavItem id="results" icon={FileText} active={activeScreen === 'results'} onClick={() => setActiveScreen('results')} />
          <MobileNavItem id="classes" icon={Users} active={activeScreen === 'classes'} onClick={() => setActiveScreen('classes')} />
        </nav>
      </div>
    </div>
  );
}

function MobileNavItem({ id, icon: Icon, active, onClick }: { id: string, icon: any, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn(
      "flex flex-col items-center gap-1 flex-1 py-1 transition-all",
      active ? "text-accent-teal" : "text-white/30"
    )}>
      <Icon size={18} className={active ? "fill-accent-teal/10" : ""} />
      <span className="text-[8px] uppercase font-bold tracking-widest">{id}</span>
    </button>
  );
}

