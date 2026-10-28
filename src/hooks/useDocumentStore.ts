import { useState } from 'react';
import { DatasheetDocument } from '../types';
import { mockDocuments } from '../data/mock';

export function useDocumentStore() {
  const [documents, setDocuments] = useState<DatasheetDocument[]>(mockDocuments);
  const [activeDocIds, setActiveDocIds] = useState<string[]>(['doc_stm32', 'doc_esp32']);

  const toggleActive = (id: string) => {
    setActiveDocIds(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const addDocument = (doc: DatasheetDocument) => {
    setDocuments(prev => [...prev, doc]);
  };

  return { documents, activeDocIds, toggleActive, addDocument };
}
