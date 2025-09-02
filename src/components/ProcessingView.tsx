import React, { useEffect, useState } from 'react';
import { Brain, Eye, FileText, Shield, Download, AlertTriangle } from 'lucide-react';
import { FileItem, PersonalDataItem } from '../types';
import { simulateProcessing } from '../utils/processing';

interface ProcessingViewProps {
  file: FileItem;
  onComplete: (fileId: string, processedData: any) => void;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ file, onComplete }) => {
  const [processingStage, setProcessingStage] = useState<'ocr' | 'nlp' | 'vision' | 'redaction' | 'encryption' | 'complete'>('ocr');
  const [progress, setProgress] = useState(0);
  const [personalData, setPersonalData] = useState<PersonalDataItem[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    const processFile = async () => {
      // Create preview URL for the original file
      const url = URL.createObjectURL(file.originalFile!);
      setPreviewUrl(url);

      const result = await simulateProcessing(
        file,
        (stage, progress, foundData) => {
          setProcessingStage(stage);
          setProgress(progress);
          if (foundData) {
            setPersonalData(foundData);
          }
        }
      );

      onComplete(file.id, result);
    };

    processFile();

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file, onComplete]);

  const stages = [
    { id: 'ocr', label: 'OCR Processing', icon: FileText, description: 'Extracting text from document...' },
    { id: 'nlp', label: 'NLP Analysis', icon: Brain, description: 'Analyzing language patterns...' },
    { id: 'vision', label: 'Vision Analysis', icon: Eye, description: 'Detecting visual elements...' },
    { id: 'redaction', label: 'Data Redaction', icon: AlertTriangle, description: 'Applying privacy filters...' },
    { id: 'encryption', label: 'Encryption', icon: Shield, description: 'Securing processed file...' },
  ];

  const currentStageIndex = stages.findIndex(stage => stage.id === processingStage);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Processing Document</h2>
          <p className="text-slate-600">AI-powered analysis and redaction in progress</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Processing Status */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                  <span className="text-sm text-slate-500">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3">
                {stages.map((stage, index) => {
                  const Icon = stage.icon;
                  const isActive = stage.id === processingStage;
                  const isCompleted = index < currentStageIndex;
                  
                  return (
                    <div
                      key={stage.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                        isActive ? 'bg-blue-50 border border-blue-200' : 
                        isCompleted ? 'bg-green-50 border border-green-200' : 
                        'bg-slate-50 border border-slate-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-blue-100' : 
                        isCompleted ? 'bg-green-100' : 
                        'bg-slate-200'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          isActive ? 'text-blue-600' : 
                          isCompleted ? 'text-green-600' : 
                          'text-slate-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          isActive ? 'text-blue-900' : 
                          isCompleted ? 'text-green-900' : 
                          'text-slate-700'
                        }`}>
                          {stage.label}
                        </h4>
                        {isActive && (
                          <p className="text-sm text-blue-600">{stage.description}</p>
                        )}
                      </div>
                      {isCompleted && (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {personalData.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-slate-900 mb-3">Personal Data Detected</h3>
                  <div className="space-y-2">
                    {personalData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div>
                          <span className="font-medium text-amber-900 capitalize">{item.type}</span>
                          <p className="text-sm text-amber-700">{item.value}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-medium text-amber-600">
                            {Math.round(item.confidence * 100)}% confidence
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* File Preview */}
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3">File Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Name:</span>
                    <span className="font-medium text-slate-900">{file.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Size:</span>
                    <span className="font-medium text-slate-900">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-medium text-slate-900">{file.type}</span>
                  </div>
                </div>
              </div>

              {previewUrl && file.type.startsWith('image/') && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-3">Preview</h3>
                  <img 
                    src={previewUrl} 
                    alt="Document preview"
                    className="w-full max-h-64 object-contain rounded-lg border border-slate-200"
                  />
                </div>
              )}

              {processingStage === 'complete' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">Processing Complete</h3>
                  </div>
                  <p className="text-green-700 text-sm mb-4">
                    Your document has been successfully processed and all personal information has been redacted.
                  </p>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Download Secured File</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};