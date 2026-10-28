import { motion } from 'framer-motion';
import { CheckCircle2, Clock } from 'lucide-react';
import { ChatMessage as ChatMessageType, Citation } from '../types';
import clsx from 'clsx';

function CitationBadge({ citation, onClick }: { citation: Citation; onClick: (c: Citation) => void }) {
  return (
    <button
      onClick={() => onClick(citation)}
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-lime-glow border border-lime-DEFAULT/30 text-lime-DEFAULT hover:shadow-glow-lime-sm transition-all duration-200 ml-0.5"
    >
      [{citation.citationIndex}]
    </button>
  );
}

function renderContent(content: string, citations: Citation[], onCitationClick: (c: Citation) => void) {
  if (!content.includes('|')) {
    return (
      <p className="text-sm text-dim leading-relaxed whitespace-pre-wrap">
        {content}
        {citations.map(c => (
          <CitationBadge key={c.citationIndex} citation={c} onClick={onCitationClick} />
        ))}
      </p>
    );
  }

  // Parse markdown table
  const lines = content.trim().split('\n');
  const tableLineIndices = lines.reduce<number[]>((acc, l, i) => l.includes('|') ? [...acc, i] : acc, []);
  const firstTableLine = tableLineIndices[0] ?? lines.length;
  const lastTableLine = tableLineIndices[tableLineIndices.length - 1] ?? -1;

  const preText = lines.slice(0, firstTableLine).join('\n').trim();
  const postText = lines.slice(lastTableLine + 1).join('\n').trim();
  const tableLines = lines
    .slice(firstTableLine, lastTableLine + 1)
    .filter(l => l.includes('|') && !l.match(/^\|[-:\s|]+\|$/));

  return (
    <div className="space-y-3">
      {preText && <p className="text-sm text-dim leading-relaxed">{preText}</p>}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-border bg-surface">
              {tableLines[0].split('|').filter(Boolean).map((h, i) => (
                <th key={i} className="px-3 py-2 text-left text-muted uppercase tracking-wider text-[10px]">
                  {h.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableLines.slice(1).map((row, ri) => (
              <tr key={ri} className="border-b border-border/50 hover:bg-surface/60 transition-colors">
                {row.split('|').filter(Boolean).map((cell, ci) => (
                  <td key={ci} className={clsx(
                    'px-3 py-2',
                    ci === 0 ? 'text-bright font-medium' : 'text-lime-DEFAULT'
                  )}>
                    {cell.trim()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {postText && <p className="text-sm text-dim leading-relaxed">{postText}</p>}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {citations.map(c => (
          <CitationBadge key={c.citationIndex} citation={c} onClick={onCitationClick} />
        ))}
      </div>
    </div>
  );
}

interface Props {
  message: ChatMessageType;
  onCitationClick: (c: Citation) => void;
}

export function ChatMessageBubble({ message, onCitationClick }: Props) {
  const isUser = message.sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={clsx('flex gap-3', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-surface border border-border-bright flex items-center justify-center shrink-0 mt-0.5"
          style={{ boxShadow: '0 0 0 1px rgba(170,255,0,0.15)' }}>
          <span className="text-[10px] font-mono text-lime-DEFAULT font-bold">SF</span>
        </div>
      )}

      <div className={clsx('max-w-[80%] space-y-2', isUser && 'items-end flex flex-col')}>
        <div className={clsx(
          'rounded-xl px-4 py-3',
          isUser
            ? 'bg-surface border border-border-bright text-sm text-bright'
            : 'bg-panel border border-border'
        )}>
          {isUser
            ? <p className="text-sm text-bright">{message.content}</p>
            : renderContent(message.content, message.citations || [], onCitationClick)
          }
        </div>

        {/* Grounding footer for assistant */}
        {!isUser && message.groundingScore && (
          <div className="flex items-center gap-3 px-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-lime-DEFAULT">
              <CheckCircle2 size={10} />
              <span>Grounding {Math.round(message.groundingScore * 100)}%</span>
            </div>
            {message.citations && (
              <span className="text-[10px] text-muted font-mono">{message.citations.length} citations</span>
            )}
            {message.latencyMs && (
              <div className="flex items-center gap-1 text-[10px] text-muted font-mono">
                <Clock size={10} />
                <span>{(message.latencyMs / 1000).toFixed(1)}s</span>
              </div>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-full bg-surface border border-border-bright flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-[10px] font-mono text-dim">KS</span>
        </div>
      )}
    </motion.div>
  );
}
