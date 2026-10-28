import { motion } from 'framer-motion';
import { Zap, GitBranch, ChevronDown } from 'lucide-react';

export function Navbar() {
  return (
    <header className="h-11 border-b border-border bg-panel/80 backdrop-blur-sm flex items-center px-4 gap-6 z-50 relative shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <motion.div
          className="w-5 h-5 relative"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Zap size={18} className="text-cyan-DEFAULT" strokeWidth={2.5} />
        </motion.div>
        <span className="font-mono text-sm font-semibold tracking-tight">
          <span className="text-bright">Spec</span>
          <span className="text-gradient-cyan">Flow</span>
        </span>
        <span className="text-muted text-xs font-mono">//</span>
        <span className="text-muted text-xs">hardware intelligence</span>
      </div>

      <div className="flex-1" />

      {/* Model selector */}
      <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border hover:border-border-bright text-xs font-mono text-dim hover:text-bright transition-all duration-200 group">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-DEFAULT group-hover:shadow-[0_0_6px_rgba(16,185,129,0.8)] transition-shadow" />
        Gemini 1.5 Pro
        <ChevronDown size={12} className="text-muted" />
      </button>

      {/* Branch */}
      <div className="flex items-center gap-1.5 text-xs text-muted font-mono">
        <GitBranch size={12} />
        <span>main</span>
      </div>

      {/* User */}
      <div className="w-7 h-7 rounded-full bg-surface border border-border-bright flex items-center justify-center text-xs font-mono text-dim">
        KS
      </div>
    </header>
  );
}
