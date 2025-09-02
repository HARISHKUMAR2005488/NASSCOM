import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { Dashboard } from './components/Dashboard';
import { ProcessingView } from './components/ProcessingView';
import { Settings } from './components/Settings';
import { FileItem } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'upload' | 'dashboard' | 'processing' | 'settings'>('upload');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentProcessingFile, setCurrentProcessingFile] = useState<FileItem | null>(null);

  const handleFileUpload = (uploadedFiles: File[]) => {
    const newFiles: FileItem[] = uploadedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      originalFile: file,
      status: 'pending',
      uploadedAt: new Date(),
      personalDataFound: [],
      processingProgress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    if (newFiles.length > 0) {
      setCurrentProcessingFile(newFiles[0]);
      setCurrentView('processing');
    }
  };

  const handleProcessingComplete = (fileId: string, processedData: any) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, ...processedData, status: 'completed' }
        : file
    ));
    setCurrentProcessingFile(null);
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="container mx-auto px-4 py-8">
        {currentView === 'upload' && (
          <UploadZone onFileUpload={handleFileUpload} />
        )}
        
        {currentView === 'processing' && currentProcessingFile && (
          <ProcessingView 
            file={currentProcessingFile} 
            onComplete={handleProcessingComplete}
          />
        )}
        
        {currentView === 'dashboard' && (
          <Dashboard 
            files={files} 
            onFileSelect={(file) => {
              setCurrentProcessingFile(file);
              setCurrentView('processing');
            }}
          />
        )}
        
        {currentView === 'settings' && (
          <Settings />
        )}
      </main>
    </div>
  );
}

export default App;