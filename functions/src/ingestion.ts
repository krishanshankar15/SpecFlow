import * as admin from 'firebase-admin';
import pdfParse from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DocumentChunk } from './types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Splits text into table-preserving chunks.
 * Preserves markdown-formatted tables and prevents row splitting.
 */
function chunkDocumentText(
  pageText: string,
  pageNumber: number,
  docId: string,
  partNumber: string
): Omit<DocumentChunk, 'embedding'>[] {
  const chunks: Omit<DocumentChunk, 'embedding'>[] = [];
  const lines = pageText.split('\n');

  let currentBlock: string[] = [];
  let isInsideTable = false;
  let blockType: 'table' | 'prose' = 'prose';
  let detectedTableId = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detect table headers or delimiter lines
    const isTableLine = trimmed.includes('|') || /^(table\s+\d+|pin\s+number|pin\s+name|symbol\s+parameter)/i.test(trimmed);
    const tableHeaderMatch = trimmed.match(/Table\s+(\d+[:.\s]+[^.\n]+)/i);

    if (tableHeaderMatch) {
      detectedTableId = `Table ${tableHeaderMatch[1].trim()}`;
    }

    if (isTableLine) {
      if (!isInsideTable && currentBlock.length > 0) {
        // Flush previous prose block
        chunks.push({
          chunkId: `${docId}_p${pageNumber}_c${chunks.length + 1}`,
          docId,
          partNumber,
          pageNumber,
          content: currentBlock.join('\n'),
          chunkType: blockType,
          tokenCount: Math.ceil(currentBlock.join('\n').length / 4),
        });
        currentBlock = [];
      }
      isInsideTable = true;
      blockType = 'table';
      currentBlock.push(trimmed);
    } else {
      if (isInsideTable && currentBlock.length > 8) {
        // Table finished, flush it as an atomic block
        chunks.push({
          chunkId: `${docId}_p${pageNumber}_c${chunks.length + 1}`,
          docId,
          partNumber,
          pageNumber,
          tableOrFigureId: detectedTableId || undefined,
          content: currentBlock.join('\n'),
          chunkType: 'table',
          tokenCount: Math.ceil(currentBlock.join('\n').length / 4),
        });
        currentBlock = [];
        isInsideTable = false;
        blockType = 'prose';
        detectedTableId = '';
      }
      currentBlock.push(trimmed);
    }

    // Keep prose blocks under ~1000 characters
    if (!isInsideTable && currentBlock.join('\n').length > 1000) {
      chunks.push({
        chunkId: `${docId}_p${pageNumber}_c${chunks.length + 1}`,
        docId,
        partNumber,
        pageNumber,
        content: currentBlock.join('\n'),
        chunkType: 'prose',
        tokenCount: Math.ceil(currentBlock.join('\n').length / 4),
      });
      currentBlock = [];
    }
  }

  // Flush remaining block
  if (currentBlock.length > 0) {
    chunks.push({
      chunkId: `${docId}_p${pageNumber}_c${chunks.length + 1}`,
      docId,
      partNumber,
      pageNumber,
      tableOrFigureId: detectedTableId || undefined,
      content: currentBlock.join('\n'),
      chunkType: blockType,
      tokenCount: Math.ceil(currentBlock.join('\n').length / 4),
    });
  }

  return chunks;
}

/**
 * Generate embedding vector using Gemini text-embedding-004
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text.slice(0, 2048));
  return result.embedding.values;
}

/**
 * Ingestion handler for uploaded PDF datasheets
 */
export async function processDatasheetPdf(
  buffer: Buffer,
  docId: string,
  partNumber: string,
  manufacturer: string
): Promise<{ totalChunks: number; pageCount: number; tablesFound: number }> {
  const db = admin.firestore();
  const docRef = db.collection('documents').doc(docId);

  // Parse PDF
  const pdfData = await pdfParse(buffer);
  const pageCount = pdfData.numpages || 1;

  await docRef.set(
    {
      docId,
      partNumber,
      manufacturer,
      pageCount,
      status: 'processing',
      progressPercent: 10,
      uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // Extract raw text and split by pages
  // pdf-parse provides page separators or raw text
  const pages = pdfData.text.split(/\f|\n(?=Page \d+)/gi);
  const allChunks: Omit<DocumentChunk, 'embedding'>[] = [];

  let tablesFound = 0;
  for (let i = 0; i < pages.length; i++) {
    const pageNum = i + 1;
    const pageChunks = chunkDocumentText(pages[i], pageNum, docId, partNumber);
    for (const chunk of pageChunks) {
      if (chunk.chunkType === 'table') tablesFound++;
      allChunks.push(chunk);
    }
  }

  // Batch embed and write to Firestore
  const chunksCollection = docRef.collection('chunks');
  const batchSize = 10;

  for (let i = 0; i < allChunks.length; i += batchSize) {
    const slice = allChunks.slice(i, i + batchSize);
    const batch = db.batch();

    await Promise.all(
      slice.map(async (chunk) => {
        let embedding: number[] = [];
        try {
          embedding = await generateEmbedding(chunk.content);
        } catch {
          // Fallback zero vector if offline/no key
          embedding = new Array(768).fill(0);
        }

        const chunkRef = chunksCollection.doc(chunk.chunkId);
        batch.set(chunkRef, {
          ...chunk,
          embedding: admin.firestore.FieldValue.vector(embedding),
          indexedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      })
    );

    await batch.commit();

    const currentPercent = Math.min(95, Math.round(10 + (85 * (i + slice.length)) / allChunks.length));
    await docRef.update({ progressPercent: currentPercent });
  }

  // Finalize document status
  await docRef.update({
    status: 'indexed',
    progressPercent: 100,
    tablesFound,
    chunkCount: allChunks.length,
    processedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { totalChunks: allChunks.length, pageCount, tablesFound };
}
