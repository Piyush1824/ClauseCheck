import express from 'express';
import multer from 'multer';
import Document from '../models/Document.js';
import { extractTextFromPdf } from '../services/pdfService.js';
import { analyzeContract, answerQuestion } from '../services/llmService.js';


const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
});

router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { text, pageCount } = await extractTextFromPdf(req.file.buffer);

    const doc = await Document.create({
      fileName: req.file.originalname,
      rawText: text,
      pageCount,
    });

    res.status(201).json({
      id: doc._id,
      fileName: doc.fileName,
      pageCount,
      characters: text.length,
      preview: text.slice(0, 300),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/analyze', async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    doc.analysis = await analyzeContract(doc.rawText);
    doc.status = 'analyzed';
    await doc.save();

    res.json(doc.analysis);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/chat', async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const answer = await answerQuestion(doc.rawText, doc.chatHistory, question.trim());

    doc.chatHistory.push({ role: 'user', content: question.trim() });
    doc.chatHistory.push({ role: 'assistant', content: answer });
    await doc.save();

    res.json({ answer });
  } catch (err) {
    next(err);
  }
});

export default router;