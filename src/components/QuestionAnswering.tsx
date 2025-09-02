import React, { useState, useCallback, useEffect } from 'react';
import { FileUp, Search, X, ArrowLeft, Maximize } from 'lucide-react';
import toast from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';


const QuestionAnswering = () => {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [answer, setAnswer] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [context, setContext] = useState('');
  const [zoomed, setZoomed] = useState(false);
  const [displayedAnswer, setDisplayedAnswer] = useState('');
  const [activeTab, setActiveTab] = useState('upload');

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const workerBlob = new Blob(
      [`importScripts("${new URL('pdfjs-dist/legacy/build/pdf.worker.min.js', import.meta.url).toString()}")`],
      { type: 'application/javascript' }
    );
  
    const workerBlobUrl = URL.createObjectURL(workerBlob);
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerBlobUrl;
  }, []);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF');
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      try {
        if (droppedFile.type === 'application/pdf') {
          const extractedText = await extractTextFromPDF(droppedFile);
          setContext(extractedText);
        } else if (droppedFile.type === 'text/plain') {
          const content = await droppedFile.text();
          setContext(content);
        }
      } catch (error) {
        toast.error('Error reading file');
        setFile(null);
      }
    }
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      try {
        if (selectedFile.type === 'application/pdf') {
          const extractedText = await extractTextFromPDF(selectedFile);
          setContext(extractedText);
        } else if (selectedFile.type === 'text/plain') {
          const content = await selectedFile.text();
          setContext(content);
        }
      } catch (error) {
        console.error('Error reading file:', error);
        setFile(null);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setDisplayedAnswer('Analyzing document...');
    setAnswer('');
    
    try {
      if (!question || !context) {
        throw new Error('Question and context are required');
      }

      const response = await fetch('http://localhost:5001/api/question-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question,
          context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get answer');
      }

      const data = await response.json();

      const cleanAnswer = data.answer?.trim?.() ?? '';
      setAnswer(cleanAnswer);
      setDisplayedAnswer(cleanAnswer);

      const userData = localStorage.getItem('user');
      const userId = userData ? JSON.parse(userData).userId : null;

      await fetch('http://localhost:5000/api/history/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          query: `Q: ${question}\n\nContext:\n${context}`,
          response: cleanAnswer,
          type: 'qa',
        }),
      });

    } catch (error) {
      console.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  type TabButtonProps = {
    name: string;
    label: string;
    isActive: boolean;
  };

  const TabButton: React.FC<TabButtonProps> = ({ name, label, isActive }) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`flex-1 py-4 text-center font-medium text-base ${
        isActive 
          ? 'text-green-600 border-b-2 border-green-600' 
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Zoomed Modal */}
      {zoomed && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-xl mx-4 relative">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Answer</h2>
              <button 
                onClick={() => setZoomed(false)} 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {displayedAnswer ? (
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{displayedAnswer}</div>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 text-center">Processing your question...</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl w-full mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white pt-16">
            Legal Document Q&A
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Upload your document and ask specific questions to get AI-powered answers
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <TabButton name="upload" label="Upload File" isActive={activeTab === 'upload'} />
                <TabButton name="paste" label="Upload Text" isActive={activeTab === 'paste'} />
              </div>
            </div>

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div
                className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center min-h-64 ${
                  isDragging 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="bg-green-50 dark:bg-green-900/30 rounded-full p-4 mb-4">
                  <FileUp className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                  Drag and drop your file here, or{' '}
                  <label className="text-green-600 hover:text-green-700 cursor-pointer font-medium">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.txt"
                      onChange={handleFileChange}
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Supports PDF and TXT files</p>
                {file && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setContext('');
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Paste Tab */}
            {activeTab === 'paste' && (
              <div className="mb-6">
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-green-500 focus:border-transparent
                           placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Paste your text here..."
                />
              </div>
            )}

            {/* Question Input */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ask your question
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-green-500 focus:border-transparent
                           placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter your legal question here..."
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isProcessing || !context || !question}
              className={`w-full mt-6 py-3 px-6 rounded-lg text-white font-medium transition-colors ${
                isProcessing || !context || !question
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Get Answer'}
            </button>
          </div>

          {/* Answer Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Answer</h2>
                <button 
                  onClick={() => setZoomed(!zoomed)} 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {zoomed ? <ArrowLeft size={18} /> : <Maximize size={18} />}
                </button>
              </div>
              <div
                className={`p-4 transition-all duration-300 ease-in-out overflow-y-auto ${
                  zoomed ? 'h-[500px] bg-gray-50 dark:bg-gray-700 shadow-xl z-10' : 'h-64'
                }`}
              >
                {displayedAnswer ? (
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{displayedAnswer}</div>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 text-center">Ask a question to get started...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionAnswering;