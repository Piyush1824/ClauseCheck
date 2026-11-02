import pdfParse from 'pdf-parse/lib/pdf-parse.js';

const MIN_TEXT_LENGTH = 100;

export async function extractTextFromPdf(buffer) {
  const data = await pdfParse(buffer);

  const text = data.text
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (text.length < MIN_TEXT_LENGTH) {
    const err = new Error(
      'Could not extract text. This looks like a scanned PDF (image-only). Please upload a text-based PDF.'
    );
    err.status = 422;
    throw err;
  }

  return { text, pageCount: data.numpages };
}