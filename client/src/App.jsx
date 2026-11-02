import { useState } from 'react';
import { uploadPdf, analyzeDoc } from './api';
import Navbar from './components/Navbar';
import UploadCard from './components/UploadCard';
import Results from './components/Results';

export default function App() {
  const [stage, setStage] = useState('upload'); // upload | loading | results
  const [step, setStep] = useState('');
  const [doc, setDoc] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  async function handleFile(file) {
    setError('');
    setStage('loading');
    try {
      setStep('Extracting text from your PDF...');
      const uploaded = await uploadPdf(file);
      setStep('AI is reading every clause...');
      const result = await analyzeDoc(uploaded.id);
      setDoc(uploaded);
      setAnalysis(result);
      setStage('results');
    } catch (err) {
      setError(err.message);
      setStage('upload');
    }
  }

  function reset() {
    setDoc(null);
    setAnalysis(null);
    setStage('upload');
  }

  return (
    <>
      <Navbar onReset={stage === 'results' ? reset : null} />
      <main className="container">
        {stage !== 'results' && (
          <UploadCard
            onFile={handleFile}
            loading={stage === 'loading'}
            step={step}
            error={error}
          />
        )}
        {stage === 'results' && <Results doc={doc} analysis={analysis} />}
      </main>
      <footer className="footer">
        ClauseCheck is an AI tool, not a lawyer. Always consult a qualified professional before signing.
      </footer>
    </>
  );
}