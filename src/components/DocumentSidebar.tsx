import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, AlertCircle, Clock, ChevronRight, FileText, Table } from 'lucide-react';
import { DatasheetDocument } from '../types';
import clsx from 'clsx';

interface Props {
  documents: DatasheetDocument[];
  activeDocIds: string[];
  onToggle: (id: string) => void;
}

function StatusDot({ status }: { status: DatasheetDocument['status'] }) {
  if (status === 'indexed') {
    return (
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-DEFAULT opacity-25" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-DEFAULT" />
      </span>
    );
  }
  if (status === 'processing') {
    return (
      <div className="w-2 h-2 rounded-full border border-amber-DEFAULT border-t-transparent animate-spin" />
    );
  }
  if (status === 'failed') return <AlertCircle size={8} className="text-rose-DEFAULT" />;
  return <Clock size={8} className="text-muted" />;
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-0.5 bg-border rounded-full overflow-hidden mt-1.5">
      <motion.div
        className="h-full bg-lime-DEFAULT rounded-full shimmer-bg"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
}

export function DocumentSidebar({ documents, activeDocIds, onToggle }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Upload logic will be wired in Phase 5
  }, []);

  return (
    <aside className="w-72 bg-panel border-r border-border flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-3">Library</p>

        {/* Dropzone */}
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={isDragging ? { scale: 1.01 } : { scale: 1 }}
          className={clsx(
            'border border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200 group',
            isDragging
              ? 'border-lime-DEFAULT bg-lime-glow shadow-glow-lime-sm'
              : 'border-border hover:border-border-bright hover:bg-surface/50'
          )}
        >
          <Upload
            size={16}
            className={clsx(
              'mx-auto mb-2 transition-colors',
              isDragging ? 'text-lime-DEFAULT' : 'text-muted group-hover:text-dim'
            )}
          />
          <p className="text-xs text-muted group-hover:text-dim transition-colors">
            Drop datasheet PDF here
          </p>
          <p className="text-[10px] text-muted/60 mt-0.5 font-mono">max 100MB · auto-detect IC</p>
        </motion.div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <AnimatePresence initial={false}>
          {documents.map((doc) => {
            const isActive = activeDocIds.includes(doc.id);
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => doc.status === 'indexed' && onToggle(doc.id)}
                  disabled={doc.status !== 'indexed'}
                  className={clsx(
                    'w-full text-left rounded-lg p-3 border transition-all duration-200 group relative overflow-hidden',
                    isActive && doc.status === 'indexed'
                      ? 'border-lime-DEFAULT/40 bg-lime-glow shadow-glow-lime-sm'
                      : 'border-border hover:border-border-bright bg-surface/30 hover:bg-surface/60',
                    doc.status !== 'indexed' && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {/* Active indicator line */}
                  {isActive && (
                    <motion.div
                      layoutId={`active-line-${doc.id}`}
                      className="absolute left-0 top-3 bottom-3 w-0.5 bg-lime-DEFAULT rounded-r-full"
                      style={{ boxShadow: '0 0 8px rgba(170,255,0,0.5)' }}
                    />
                  )}

                  <div className="flex items-start gap-2.5 pl-1.5">
                    <div className="mt-0.5">
                      <StatusDot status={doc.status} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={clsx(
                        'font-mono text-xs font-semibold truncate transition-colors',
                        isActive ? 'text-lime-DEFAULT' : 'text-bright'
                      )}>
                        {doc.partNumber}
                      </p>
                      <p className="text-[10px] text-muted truncate mt-0.5">{doc.manufacturer}</p>

                      {doc.status === 'processing' && (
                        <div>
                          <p className="text-[10px] text-amber-DEFAULT font-mono mt-1">
                            {doc.progressPercent}% indexed
                          </p>
                          <ProgressBar value={doc.progressPercent} />
                        </div>
                      )}

                      {doc.status === 'indexed' && (
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-[10px] text-muted font-mono">
                            <FileText size={9} />
                            {doc.pageCount}p
                          </span>
                          {doc.tablesFound && (
                            <span className="flex items-center gap-1 text-[10px] text-muted font-mono">
                              <Table size={9} />
                              {doc.tablesFound} tables
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {isActive && (
                      <ChevronRight size={12} className="text-lime-DEFAULT shrink-0 mt-0.5" />
                    )}
                  </div>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer stats */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center justify-between text-[10px] font-mono text-muted">
          <span>{documents.filter(d => d.status === 'indexed').length} indexed</span>
          <span className="text-muted/60">28 MB used</span>
        </div>
      </div>
    </aside>
  );
}
