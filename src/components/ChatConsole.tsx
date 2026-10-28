import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Cpu, Clock, BarChart2, GitCompare } from 'lucide-react';
import { ChatMessage as ChatMessageType, Citation, DatasheetDocument } from '../types';
import { ChatMessageBubble } from './ChatMessage';
import { mockMessages } from '../data/mock';
import clsx from 'clsx';

const QUICK_ACTIONS = [
  { label: 'Absolute Max Ratings', icon: Zap, color: 'rose' },
  { label: 'Pinout & GPIO', icon: Cpu, color: 'lime' },
  { label: 'I²C / SPI Timing', icon: Clock, color: 'amber' },
  { label: 'Compare Active ICs', icon: GitCompare, color: 'lime' },
  { label: 'Power Consumption', icon: BarChart2, color: 'dim' },
] as const;

interface Props {
  activeDocIds: string[];
  documents: DatasheetDocument[];
  onCitationClick: (c: Citation) => void;
}

export function ChatConsole({ activeDocIds, documents, onCitationClick }: Props) {
  const [messages, setMessages] = useState<ChatMessageType[]>(mockMessages);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeDocs = documents.filter(d => activeDocIds.includes(d.id));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessageType = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    // API call will be wired in Phase 6
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {/* Active context strip */}
      <div className="px-4 py-2 border-b border-border bg-panel/50 flex items-center gap-2 flex-wrap shrink-0">
        <span className="text-[10px] font-mono text-muted uppercase tracking-widest mr-1">Context</span>
        <AnimatePresence>
          {activeDocs.length === 0 ? (
            <span className="text-[10px] text-muted/60 font-mono">No components selected</span>
          ) : (
            activeDocs.map(doc => (
              <motion.span
                key={doc.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-lime-glow border border-lime-DEFAULT/30 text-[10px] font-mono text-lime-DEFAULT shadow-glow-lime-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-lime-DEFAULT animate-pulse-slow" />
                {doc.partNumber}
              </motion.span>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <ChatMessageBubble key={msg.id} message={msg} onCitationClick={onCitationClick} />
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Quick actions */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0">
        {QUICK_ACTIONS.map(({ label, icon: Icon, color }) => (
          <button
            key={label}
            onClick={() => setInput(label)}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono whitespace-nowrap transition-all duration-200 shrink-0',
              color === 'rose' && 'border-rose-DEFAULT/30 text-rose-DEFAULT bg-rose-dim/30 hover:bg-rose-dim/50',
              color === 'lime' && 'border-lime-DEFAULT/25 text-lime-DEFAULT bg-lime-glow hover:shadow-glow-lime-sm',
              color === 'amber' && 'border-amber-DEFAULT/30 text-amber-DEFAULT bg-amber-dim/30 hover:bg-amber-dim/50',
              color === 'dim' && 'border-border text-muted hover:border-border-bright hover:text-dim',
            )}
          >
            <Icon size={11} />
            {label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-4 shrink-0">
        <div className="flex items-end gap-2 bg-surface border border-border-bright rounded-xl p-3 focus-within:border-lime-DEFAULT/40 focus-within:shadow-glow-lime-sm transition-all duration-300">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about pin voltages, max ratings, timing diagrams..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-bright placeholder:text-muted/50 resize-none outline-none font-mono leading-relaxed max-h-32"
          />
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className={clsx(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0',
              input.trim()
                ? 'bg-lime-DEFAULT text-canvas font-bold shadow-glow-lime-sm'
                : 'bg-surface text-muted cursor-not-allowed'
            )}
          >
            <Send size={14} />
          </motion.button>
        </div>
        <p className="text-[10px] text-muted/50 font-mono mt-1.5 px-1">↵ send · ⇧↵ newline</p>
      </div>
    </div>
  );
}
