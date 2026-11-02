import mongoose from 'mongoose';

const clauseSchema = new mongoose.Schema(
  {
    title: String,
    originalText: String,
    riskLevel: { type: String, enum: ['low', 'medium', 'high'] },
    explanation: String,
    plainEnglish: String,
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant'] },
    content: String,
  },
  { _id: false, timestamps: true }
);

const documentSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    rawText: { type: String, required: true },
    pageCount: Number,
    status: {
      type: String,
      enum: ['uploaded', 'analyzed', 'failed'],
      default: 'uploaded',
    },
    analysis: {
      contractType: String,
      riskScore: Number,
      summary: String,
      clauses: [clauseSchema],
    },
    chatHistory: [messageSchema],
  },
  { timestamps: true }
);

const Document = mongoose.model('Document', documentSchema);

export default Document;