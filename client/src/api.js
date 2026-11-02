async function request(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

export function uploadPdf(file) {
  const form = new FormData();
  form.append('file', file);
  return request('/api/documents/upload', { method: 'POST', body: form });
}

export const analyzeDoc = (id) =>
  request(`/api/documents/${id}/analyze`, { method: 'POST' });

export const askQuestion = (id, question) =>
  request(`/api/documents/${id}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });