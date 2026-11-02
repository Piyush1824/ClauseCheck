import OpenAI from 'openai';

const MAX_CHARS = 20000;

let client;
function getClient() {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }
  return client;
}

const model = () => process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const ANALYZE_PROMPT = `You are a contract analysis assistant that helps non-lawyers.
Analyze the contract and respond with ONLY valid JSON in this exact shape:
{
  "contractType": "e.g. Rental Agreement",
  "riskScore": 0-100 (integer, higher = riskier for the person signing),
  "summary": "2-3 sentence plain summary",
  "clauses": [
    {
      "title": "short clause name",
      "originalText": "exact quote from the contract (max 300 chars)",
      "riskLevel": "low" | "medium" | "high",
      "explanation": "why this clause is risky or notable",
      "plainEnglish": "translate the legal jargon into simple everyday language"
    }
  ]
}
Flag 3-10 clauses that matter most (penalties, auto-renewal, termination, liability,
non-compete, IP ownership, fees, unilateral changes). Only use information from the contract.`;

export async function analyzeContract(text) {
  const res = await getClient().chat.completions.create({
    model: model(),
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: ANALYZE_PROMPT },
      { role: 'user', content: text.slice(0, MAX_CHARS) },
    ],
  });

  let data;
  try {
    data = JSON.parse(res.choices[0].message.content);
  } catch {
    const err = new Error('AI returned an invalid response. Please try again.');
    err.status = 502;
    throw err;
  }

  const levels = ['low', 'medium', 'high'];
  return {
    contractType: String(data.contractType || 'Contract'),
    riskScore: Math.min(100, Math.max(0, Math.round(Number(data.riskScore) || 0))),
    summary: String(data.summary || ''),
    clauses: (Array.isArray(data.clauses) ? data.clauses : []).map((c) => ({
      title: c.title,
      originalText: c.originalText,
      riskLevel: levels.includes(c.riskLevel) ? c.riskLevel : 'medium',
      explanation: c.explanation,
      plainEnglish: c.plainEnglish,
    })),
  };
}

export async function answerQuestion(text, history, question) {
  const res = await getClient().chat.completions.create({
    model: model(),
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content:
          'You answer questions about the contract below in plain English. ' +
          'Use only the contract. If it does not say, say so. Do not give legal advice.\n\n' +
          `CONTRACT:\n${text.slice(0, MAX_CHARS)}`,
      },
      ...history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: question },
    ],
  });
  return res.choices[0].message.content;
}