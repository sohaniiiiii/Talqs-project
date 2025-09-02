// import React, { useState, useCallback, useEffect } from 'react';
// import { FileUp, Download, X, ArrowLeft, Maximize } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
// import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.entry?worker';

// const Summarization = () => {
//   const navigate = useNavigate();
//   const [file, setFile] = useState<File | null>(null);
//   const [text, setText] = useState('');
//   const [isDragging, setIsDragging] = useState(false);
//   const [summary, setSummary] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [zoomed, setZoomed] = useState(false);
//   const [displayedSummary, setDisplayedSummary] = useState('');
//   const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'paste'

//   // Scroll to top on component mount
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, []);

//   // Set up PDF.js worker
//   useEffect(() => {
//     const workerBlob = new Blob(
//       [importScripts("${new URL('pdfjs-dist/legacy/build/pdf.worker.min.js', import.meta.url).toString()}")],
//       { type: 'application/javascript' }
//     );
    
//     const workerBlobUrl = URL.createObjectURL(workerBlob);
//     pdfjsLib.GlobalWorkerOptions.workerSrc = workerBlobUrl;
//   }, []);

//   const extractTextFromPDF = async (file: File): Promise<string> => {
//     try {
//       const arrayBuffer = await file.arrayBuffer();
//       const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
//       let fullText = '';
      
//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
//         const textContent = await page.getTextContent();
//         const pageText = textContent.items
//           .map((item: any) => item.str)
//           .join(' ');
//         fullText += pageText + '\n';
//       }
      
//       return fullText;
//     } catch (error) {
//       console.error('PDF extraction error:', error);
//       throw new Error('Failed to extract text from PDF');
//     }
//   };

//   const handleDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   }, []);

//   const handleDragLeave = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//   }, []);

//   const handleDrop = useCallback(async (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
    
//     const droppedFile = e.dataTransfer.files[0];
//     if (droppedFile) {
//       setFile(droppedFile);
//       try {
//         if (droppedFile.type === 'application/pdf') {
//           const extractedText = await extractTextFromPDF(droppedFile);
//           setText(extractedText);
//         } else if (droppedFile.type === 'text/plain') {
//           const content = await droppedFile.text();
//           setText(content);
//         }
//       } catch (error) {
//         toast.error('Error reading file');
//         setFile(null);
//       }
//     }
//   }, []);

//   const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       try {
//         if (selectedFile.type === 'application/pdf') {
//           const extractedText = await extractTextFromPDF(selectedFile);
//           setText(extractedText);
//         } else if (selectedFile.type === 'text/plain') {
//           const content = await selectedFile.text();
//           setText(content);
//         }
//       } catch (error) {
//         toast.error('Error reading file');
//         setFile(null);
//       }
//     }
//   }, []);


//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setIsProcessing(true);
//   setDisplayedSummary('Generating summary...');
//   setSummary('');

//   try {
//     if (!text) {
//       throw new Error('Please provide text to summarize');
//     }

//     // 1. Call Flask backend to generate summary
//     const response = await fetch('http://localhost:5001/api/summarize', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ text }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to generate summary');
//     }

//     const data = await response.json();

//     if (!data.summary || typeof data.summary !== 'string') {
//       throw new Error('Invalid summary received from server');
//     }

//     const cleanSummary = data.summary.replace(/undefined/g, '').trim();
//     setSummary(cleanSummary);

//     // 2. Save history to Node.js backend
//     // Make sure you have userId available (e.g. from auth context)
//     // const userId = /* get userId from your auth or state here */;
//     const userData = localStorage.getItem('user');
//     const userId = userData ? JSON.parse(userData).userId : null;

    
//     await fetch('http://localhost:5000/api/history/save', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         userId,
//         query: text,
//         response: cleanSummary,
//         type: 'summary', // or 'qa' depending on context
//       }),
//     });

//     // 3. Animate summary display
//     const animateSummary = (fullText: string) => {
//       const sentences = fullText.split('. ').map(s => s.trim());
//       let currentIndex = 0;
//       setDisplayedSummary('');

//       const interval = setInterval(() => {
//         if (currentIndex < sentences.length) {
//           const sentence = sentences[currentIndex];
//           const punctuation = sentence.endsWith('.') ? '' : '. ';
//           setDisplayedSummary(prev => prev + sentence + punctuation + ' ');
//           currentIndex++;
//         } else {
//           clearInterval(interval);
//         }
//       }, 80);
//     };

//     animateSummary(cleanSummary);

//   } catch (error) {
//     toast.error(error instanceof Error ? error.message : 'An error occurred');
//     setDisplayedSummary('');
//   } finally {
//     setIsProcessing(false);
//   }
// };

//   const handleDownload = () => {
//     const blob = new Blob([summary], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'summary.txt';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   type TabButtonProps = {
//     name: string;
//     label: string;
//     isActive: boolean;
//   };

//   const TabButton: React.FC<TabButtonProps> = ({ name, label, isActive }) => (
//     <button
//       onClick={() => setActiveTab(name)}
//       className={`flex-1 py-4 text-center font-medium text-base ${
//         isActive 
//           ? 'text-green-600 border-b-2 border-green-600' 
//           : 'text-gray-500 hover:text-gray-700'
//       }`}
//     >
//       {label}
//     </button>
//   );

//   return (
//     <div className="flex flex-col min-h-screen bg-white dark:bg-gray-800">
//       {/* Zoom overlay for summary */}
//       {zoomed && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 relative">
//             <div className="flex items-center justify-between border-b border-gray-200 p-4">
//               <h2 className="text-lg font-medium text-gray-900 ">Summary</h2>
//               <div className="flex items-center space-x-2">
//                 {summary && (
//                   <button
//                     onClick={handleDownload}
//                     className="text-green-600 hover:text-green-700"
//                     title="Download summary"
//                   >
//                     <Download size={18} />
//                   </button>
//                 )}
//                 <button 
//                   onClick={() => setZoomed(false)} 
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>
//             <div className="p-6 max-h-[80vh] overflow-y-auto">
//               {isProcessing ? (
//                 <div className="flex items-center justify-center h-32">
//                   <p className="text-gray-500 animate-pulse ">Generating summary...</p>
//                 </div>
//               ) : displayedSummary ? (
//                 <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
//                   {displayedSummary.split('\n\n').map((paragraph, index) => (
//                     <p key={index} className={index < displayedSummary.split('\n\n').length - 1 ? 'mb-4' : ''}>
//                       {paragraph}
//                     </p>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-400 text-center ">No summary generated yet...</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-5xl w-full mx-auto px-4 py-8">
//         <button
//           onClick={() => navigate(-1)}
//           className="md:hidden absolute top-4 left-4 z-50 p-2 flex items-center text-gray-600 hover:text-gray-900"
//         >
//           <ArrowLeft className="h-5 w-5 mr-1" />
//           Back
//         </button>
        
//         <div className="text-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-900 pt-16 dark:text-white">Document Summarization</h1>
//           <p className="text-gray-600 mt-2 dark:text-white">
//             Upload your document to get an AI-powered summary of the content
//           </p>
//         </div>

//         <div className="mt-14 grid grid-cols-1 lg:grid-cols-5 gap-6">
//           <div className="lg:col-span-3">
//             <div className="mb-6">
//               <div className="flex border-b border-gray-200">
//                 <TabButton name="upload" label="Upload File" isActive={activeTab === 'upload'} />
//                 <TabButton name="paste" label="Upload Text" isActive={activeTab === 'paste'} />
//               </div>
//             </div>

//             {activeTab === 'upload' && (
//               <div
//                 className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center min-h-64 ${
//                   isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300'
//                 }`}
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 onDrop={handleDrop}
//               >
//                 <div className="bg-green-50 rounded-full p-4 mb-4">
//                   <FileUp className="h-8 w-8 text-green-500" />
//                 </div>
//                 <p className="text-lg text-gray-700 mb-2 dark:text-white">
//                   Drag and drop your file here, or{' '}
//                   <label className="text-green-600 hover:text-green-700 cursor-pointer font-medium dark:text-white">
//                     browse
//                     <input
//                       type="file"
//                       className="hidden"
//                       accept=".pdf,.txt"
//                       onChange={handleFileChange}
//                     />
//                   </label>
//                 </p>
//                 <p className="text-sm text-gray-500">Supports PDF and TXT files</p>
//                 {file && (
//                   <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-700">
//                     <span>{file.name}</span>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setFile(null);
//                         setText('');
//                       }}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <X size={16} />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}

//             {activeTab === 'paste' && (
//               <div className="mb-6">
//                 <textarea
//                   value={text}
//                   onChange={(e) => setText(e.target.value)}
//                   className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   placeholder="Paste your text here..."
//                 />
//               </div>
//             )}

//             <button
//               onClick={handleSubmit}
//               disabled={isProcessing || !text}
//               className={`w-full mt-8 py-3 px-6 rounded-lg text-white font-medium dark:bg-gray-700 ${
//                 isProcessing || !text
//                   ? 'bg-gray-400 cursor-not-allowed'
//                   : 'bg-green-600 hover:bg-green-700'
//               }`}
//             >
//               {isProcessing ? 'Processing...' : 'Generate Summary'}
//             </button>
//           </div>

//           <div className="lg:col-span-2">
//             <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-700">
//               <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:bg-gray-700">
//                 <h2 className="text-lg font-medium text-gray-900 ">Summary</h2>
//                 <div className="flex items-center space-x-2">
//                   {summary && (
//                     <button
//                       onClick={handleDownload}
//                       className="text-green-600 hover:text-green-700"
//                       title="Download summary"
//                     >
//                       <Download size={18} />
//                     </button>
//                   )}
//                   <button 
//                     onClick={() => setZoomed(!zoomed)} 
//                     className="text-gray-500 hover:text-gray-700"
//                     title={zoomed ? "Minimize" : "Maximize"}
//                   >
//                     {zoomed ? <ArrowLeft size={18} /> : <Maximize size={18} />}
//                   </button>
//                 </div>
//               </div>
//               <div
//                 className={`p-4 transition-all duration-300 ease-in-out overflow-y-auto ${
//                   zoomed ? 'h-[600px] bg-gray-50 shadow-xl z-10' : 'h-96'
//                 }`}
//               >
//                 {isProcessing ? (
//                   <div className="flex items-center justify-center h-full">
//                     <p className="text-gray-500 animate-pulse dark:text-white">Generating summary...</p>
//                   </div>
//                 ) : displayedSummary ? (
//                   <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
//                     {displayedSummary.split('\n\n').map((paragraph, index) => (
//                       <p key={index} className={index < displayedSummary.split('\n\n').length - 1 ? 'mb-4' : ''}>
//                         {paragraph}
//                       </p>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center h-full">
//                     <p className="text-gray-400 text-center dark:text-white">No summary generated yet...</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Summarization;







import React, { useState, useCallback, useEffect } from 'react';
import { FileUp, Download, X, ArrowLeft, Maximize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.entry?worker';

const Summarization = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [summary, setSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [displayedSummary, setDisplayedSummary] = useState('');
  const [activeTab, setActiveTab] = useState('upload');

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Set up PDF.js worker
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
          setText(extractedText);
        } else if (droppedFile.type === 'text/plain') {
          const content = await droppedFile.text();
          setText(content);
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
          setText(extractedText);
        } else if (selectedFile.type === 'text/plain') {
          const content = await selectedFile.text();
          setText(content);
        }
      } catch (error) {
        toast.error('Error reading file');
        setFile(null);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setDisplayedSummary('Generating summary...');
    setSummary('');

    try {
      if (!text) {
        throw new Error('Please provide text to summarize');
      }

      const response = await fetch('http://localhost:5001/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();

      if (!data.summary || typeof data.summary !== 'string') {
        throw new Error('Invalid summary received from server');
      }

      const cleanSummary = data.summary.replace(/undefined/g, '').trim();
      setSummary(cleanSummary);

      const userData = localStorage.getItem('user');
      const userId = userData ? JSON.parse(userData).userId : null;

      await fetch('http://localhost:5000/api/history/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          query: text,
          response: cleanSummary,
          type: 'summary',
        }),
      });

      const animateSummary = (fullText: string) => {
        const sentences = fullText.split('. ').map(s => s.trim());
        let currentIndex = 0;
        setDisplayedSummary('');

        const interval = setInterval(() => {
          if (currentIndex < sentences.length) {
            const sentence = sentences[currentIndex];
            const punctuation = sentence.endsWith('.') ? '' : '. ';
            setDisplayedSummary(prev => prev + sentence + punctuation + ' ');
            currentIndex++;
          } else {
            clearInterval(interval);
          }
        }, 80);
      };

      animateSummary(cleanSummary);

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
      setDisplayedSummary('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      {/* Zoom overlay for summary */}
      {zoomed && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4 relative">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Summary</h2>
              <div className="flex items-center space-x-2">
                {summary && (
                  <button
                    onClick={handleDownload}
                    className="text-green-600 hover:text-green-700"
                    title="Download summary"
                  >
                    <Download size={18} />
                  </button>
                )}
                <button 
                  onClick={() => setZoomed(false)} 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {isProcessing ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-gray-500 dark:text-gray-400 animate-pulse">Generating summary...</p>
                </div>
              ) : displayedSummary ? (
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {displayedSummary.split('\n\n').map((paragraph, index) => (
                    <p key={index} className={index < displayedSummary.split('\n\n').length - 1 ? 'mb-4' : ''}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 text-center">No summary generated yet...</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl w-full mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="md:hidden absolute top-4 left-4 z-50 p-2 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white pt-16">
            Document Summarization
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Upload your document to get an AI-powered summary of the content
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-5 gap-6">
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
                  <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setText('');
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* FIXED: Paste Tab with proper dark mode styling */}
            {activeTab === 'paste' && (
              <div className="mb-6">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-green-500 focus:border-transparent
                           placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Paste your text here..."
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isProcessing || !text}
              className={`w-full mt-8 py-3 px-6 rounded-lg text-white font-medium ${
                isProcessing || !text
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Generate Summary'}
            </button>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Summary</h2>
                <div className="flex items-center space-x-2">
                  {summary && (
                    <button
                      onClick={handleDownload}
                      className="text-green-600 hover:text-green-700"
                      title="Download summary"
                    >
                      <Download size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => setZoomed(!zoomed)} 
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    title={zoomed ? "Minimize" : "Maximize"}
                  >
                    {zoomed ? <ArrowLeft size={18} /> : <Maximize size={18} />}
                  </button>
                </div>
              </div>
              <div
                className={`p-4 transition-all duration-300 ease-in-out overflow-y-auto ${
                  zoomed ? 'h-[600px] bg-gray-50 dark:bg-gray-700 shadow-xl z-10' : 'h-96'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400 animate-pulse">Generating summary...</p>
                  </div>
                ) : displayedSummary ? (
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {displayedSummary.split('\n\n').map((paragraph, index) => (
                      <p key={index} className={index < displayedSummary.split('\n\n').length - 1 ? 'mb-4' : ''}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 dark:text-gray-500 text-center">No summary generated yet...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summarization;