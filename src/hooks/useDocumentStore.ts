import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { DatasheetDocument } from '../types';
import { mockDocuments } from '../data/mock';

export function useDocumentStore() {
  const [documents, setDocuments] = useState<DatasheetDocument[]>(mockDocuments);
  const [activeDocIds, setActiveDocIds] = useState<string[]>(['doc_stm32', 'doc_esp32']);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);

  useEffect(() => {
    try {
      const q = query(collection(db, 'documents'), orderBy('uploadedAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const firestoreDocs: DatasheetDocument[] = snapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              return {
                id: docSnap.id,
                filename: data.filename || 'datasheet.pdf',
                partNumber: data.partNumber || 'Unknown IC',
                manufacturer: data.manufacturer || 'Generic',
                pageCount: data.pageCount || 1,
                status: data.status || 'indexed',
                progressPercent: data.progressPercent ?? 100,
                uploadedAt: data.uploadedAt?.toDate ? data.uploadedAt.toDate() : new Date(),
                tablesFound: data.tablesFound || 0,
              };
            });
            setDocuments(firestoreDocs);
            // Default select top 2 if none selected
            setActiveDocIds((prev) => (prev.length > 0 ? prev : firestoreDocs.slice(0, 2).map((d) => d.id)));
          }
          setIsFirebaseConnected(true);
        },
        (error) => {
          console.warn('Firestore subscription using local mock documents:', error.message);
          setIsFirebaseConnected(true); // Still connected to Firebase app, just empty or permission pending
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase init fallback:', err);
    }
  }, []);

  const toggleActive = (id: string) => {
    setActiveDocIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const addDocument = (doc: DatasheetDocument) => {
    setDocuments((prev) => [doc, ...prev]);
  };

  return { documents, activeDocIds, toggleActive, addDocument, isFirebaseConnected };
}
