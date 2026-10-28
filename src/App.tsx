import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DocumentSidebar } from './components/DocumentSidebar';
import { ChatConsole } from './components/ChatConsole';
import { CitationPanel } from './components/CitationPanel';
import { useDocumentStore } from './hooks/useDocumentStore';
import { Citation } from './types';

export default function App() {
  const { documents, activeDocIds, toggleActive } = useDocumentStore();
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  return (
    <div className="h-screen flex flex-col bg-canvas overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <DocumentSidebar
          documents={documents}
          activeDocIds={activeDocIds}
          onToggle={toggleActive}
        />
        <ChatConsole
          activeDocIds={activeDocIds}
          documents={documents}
          onCitationClick={setActiveCitation}
        />
        <CitationPanel
          citation={activeCitation}
          documents={documents}
          onClose={() => setActiveCitation(null)}
        />
      </div>
    </div>
  );
}
