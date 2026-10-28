import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v2';
import cors from 'cors';
import { executeRagPipeline } from './ragPipeline';
import { processDatasheetPdf } from './ingestion';
import { ChatQueryRequest } from './types';

admin.initializeApp();

const corsHandler = cors({ origin: true });

/**
 * HTTPS Callable: /chatQuery
 * Executes the streamlined RAG pipeline: Retrieve -> Answer -> Grounding check
 */
export const chatQuery = functions.https.onRequest(
  {
    cors: true,
    timeoutSeconds: 60,
    memory: '1GiB',
  },
  async (req, res) => {
    corsHandler(req, res, async () => {
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
      }

      try {
        const body = req.body as ChatQueryRequest;
        if (!body.query || !body.activeDocIds) {
          res.status(400).json({ error: 'Missing required fields: query and activeDocIds' });
          return;
        }

        const response = await executeRagPipeline(body);
        res.status(200).json(response);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
        res.status(500).json({ error: errorMessage });
      }
    });
  }
);

/**
 * HTTPS Callable: /ingestDatasheet
 * Processes and indexes a datasheet PDF into Firestore vector embeddings
 */
export const ingestDatasheet = functions.https.onRequest(
  {
    cors: true,
    timeoutSeconds: 300,
    memory: '2GiB',
  },
  async (req, res) => {
    corsHandler(req, res, async () => {
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
      }

      try {
        const { docId, partNumber, manufacturer, base64Pdf } = req.body;
        if (!docId || !partNumber || !base64Pdf) {
          res.status(400).json({ error: 'Missing docId, partNumber, or base64Pdf' });
          return;
        }

        const pdfBuffer = Buffer.from(base64Pdf, 'base64');
        const result = await processDatasheetPdf(
          pdfBuffer,
          docId,
          partNumber,
          manufacturer || 'Generic'
        );

        res.status(200).json({ success: true, ...result });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Internal Ingestion Error';
        res.status(500).json({ error: errorMessage });
      }
    });
  }
);
