import { DatasheetDocument, ChatMessage } from '../types';

export const mockDocuments: DatasheetDocument[] = [
  {
    id: 'doc_stm32',
    filename: 'STM32F401RE_Datasheet.pdf',
    partNumber: 'STM32F401RE',
    manufacturer: 'STMicroelectronics',
    pageCount: 142,
    status: 'indexed',
    progressPercent: 100,
    uploadedAt: new Date('2024-01-15'),
    tablesFound: 38,
  },
  {
    id: 'doc_esp32',
    filename: 'ESP32-S3-WROOM-1_Datasheet.pdf',
    partNumber: 'ESP32-S3-WROOM-1',
    manufacturer: 'Espressif Systems',
    pageCount: 84,
    status: 'indexed',
    progressPercent: 100,
    uploadedAt: new Date('2024-01-16'),
    tablesFound: 21,
  },
  {
    id: 'doc_lm317',
    filename: 'LM317_Datasheet.pdf',
    partNumber: 'LM317-Adj',
    manufacturer: 'Texas Instruments',
    pageCount: 34,
    status: 'processing',
    progressPercent: 64,
    uploadedAt: new Date('2024-01-17'),
  },
];

export const mockMessages: ChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'user',
    content: 'Compare operating voltage, max junction temp, and ADC resolution between STM32F401RE and ESP32-S3.',
    timestamp: new Date('2024-01-17T10:30:00'),
  },
  {
    id: 'msg_2',
    sender: 'assistant',
    content: `Here is the verified comparative analysis across both datasheets:

| Parameter | STM32F401RE | ESP32-S3 |
|---|---|---|
| VDD Voltage | 1.7V – 3.6V | 3.0V – 3.6V |
| Max Junction Temp (Tj) | 125°C | 105°C |
| ADC Resolution | 12-bit / 16ch | 12-bit / 20ch |
| ADC Sample Rate | Up to 2.4 MSPS | Up to 2 MSPS |

The STM32F401RE has a wider supply voltage range making it suitable for battery-powered designs with LDO dropout. The ESP32-S3 offers more ADC channels at a slightly lower junction temperature ceiling.`,
    timestamp: new Date('2024-01-17T10:30:02'),
    citations: [
      { citationIndex: 1, docId: 'doc_stm32', partNumber: 'STM32F401RE', pageNumber: 47, tableOrFigure: 'Table 14', snippet: 'VDD min 1.7V, VDD max 3.6V, Tj max 125°C', confidence: 0.994 },
      { citationIndex: 2, docId: 'doc_esp32', partNumber: 'ESP32-S3', pageNumber: 22, tableOrFigure: 'Table 3', snippet: 'VDD 3.0V to 3.6V, Tj max 105°C, 20-channel 12-bit ADC', confidence: 0.981 },
    ],
    groundingScore: 0.98,
    latencyMs: 1240,
  },
];
