import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, ExternalLink, Hash, CheckCircle2 } from 'lucide-react';
import { Citation, DatasheetDocument } from '../types';

interface Props {
  citation: Citation | null;
  documents: DatasheetDocument[];
  onClose: () => void;
}

export function CitationPanel({ citation, documents, onClose }: Props) {
  const doc = citation ? documents.find(d => d.id === citation.docId) : null;

  return (
    <AnimatePresence>
      {citation && (
        <motion.aside
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-80 bg-panel border-l border-border flex flex-col h-full shrink-0"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-muted uppercase tracking-widest">Citation [{citation.citationIndex}]</p>
              <p className="text-sm font-mono text-cyan-DEFAULT font-semibold mt-0.5">
                {citation.partNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-md border border-border hover:border-border-bright flex items-center justify-center text-muted hover:text-bright transition-all"
            >
              <X size={13} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Location metadata */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono">
                <FileText size={12} className="text-muted" />
                <span className="text-muted">Document</span>
              </div>
              <p className="text-sm text-bright font-mono pl-5">{doc?.filename || citation.docId}</p>

              <div className="flex items-center gap-4 pl-5 pt-1">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface border border-border">
                  <Hash size={10} className="text-muted" />
                  <span className="text-xs font-mono text-dim">Page {citation.pageNumber}</span>
                </div>
                {citation.tableOrFigure && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface border border-border">
                    <span className="text-xs font-mono text-dim">{citation.tableOrFigure}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Snippet */}
            <div className="rounded-lg border border-emerald-DEFAULT/30 bg-emerald-glow p-3">
              <p className="text-[10px] font-mono text-muted uppercase tracking-wider mb-2">Matched Text</p>
              <p className="text-xs font-mono text-emerald-DEFAULT leading-relaxed">"{citation.snippet}"</p>
            </div>

            {/* Confidence */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center gap-1.5 text-muted">
                  <CheckCircle2 size={10} />
                  <span>Extraction confidence</span>
                </div>
                <span className="text-emerald-DEFAULT">{(citation.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-DEFAULT rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${citation.confidence * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                />
              </div>
            </div>

            {/* PDF jump CTA */}
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-border hover:border-cyan-DEFAULT/50 hover:shadow-glow-cyan text-xs font-mono text-muted hover:text-cyan-DEFAULT transition-all duration-200 group">
              <ExternalLink size={12} className="group-hover:rotate-12 transition-transform" />
              Open Page {citation.pageNumber} in PDF
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
