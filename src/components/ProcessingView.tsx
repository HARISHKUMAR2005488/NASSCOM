import React, { useEffect, useState } from 'react';
import { Brain, Eye, FileText, Shield, Download, AlertTriangle, MapPin, Phone, Mail, User, Calendar, CreditCard, CheckCircle } from 'lucide-react';
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
  const [currentStageData, setCurrentStageData] = useState<PersonalDataItem[]>([]);

  useEffect(() => {
    const processFile = async () => {
      // Create preview URL for the original file
      const url = URL.createObjectURL(file.originalFile!);
      setPreviewUrl(url);

      const result = await simulateProcessing(
        file,
        (stage, progress, foundData) => {
          setProcessingStage(stage as any);
          setProgress(progress);
          if (foundData) {
            setCurrentStageData(foundData);
            setPersonalData(prev => [...prev, ...foundData]);
          }
        }
      );

      setProcessingStage('complete');
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
    { id: 'ocr', label: 'OCR Processing', icon: FileText, description: 'Extracting text from document...', color: 'blue' },
    { id: 'nlp', label: 'NLP Analysis', icon: Brain, description: 'Analyzing language patterns...', color: 'green' },
    { id: 'vision', label: 'Vision Analysis', icon: Eye, description: 'Detecting visual elements...', color: 'purple' },
    { id: 'redaction', label: 'Data Redaction', icon: AlertTriangle, description: 'Applying privacy filters...', color: 'amber' },
    { id: 'encryption', label: 'Encryption', icon: Shield, description: 'Securing processed file...', color: 'indigo' },
  ];

  const currentStageIndex = stages.findIndex(stage => stage.id === processingStage);

  const getDataTypeIcon = (type: string) => {
    switch (type) {
      case 'name': return <User className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'address': return <MapPin className="w-4 h-4" />;
      case 'date': return <Calendar className="w-4 h-4" />;
      case 'ssn': case 'id_number': return <CreditCard className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getDataTypeColor = (type: string) => {
    switch (type) {
      case 'name': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'email': return 'bg-green-100 text-green-800 border-green-200';
      case 'phone': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'address': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'date': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'ssn': case 'id_number': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const downloadRedactedFile = () => {
    // Simulate downloading the redacted file
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `redacted_${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadEncryptedFile = () => {
    // Simulate downloading the encrypted file
    const encryptedContent = new Blob(['[ENCRYPTED FILE CONTENT]'], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(encryptedContent);
    const link = document.createElement('a');
    link.href = url;
    link.download = `encrypted_${file.name}.enc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Processing: {file.name}</h2>
              <p className="text-slate-600">AI-powered analysis and redaction in progress</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">File Size</div>
              <div className="font-semibold text-slate-900">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Processing Status */}
            <div className="xl:col-span-1 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                  <span className="text-sm text-slate-500">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900 mb-3">Processing Stages</h3>
                {stages.map((stage, index) => {
                  const Icon = stage.icon;
                  const isActive = stage.id === processingStage;
                  const isCompleted = index < currentStageIndex;
                  
                  return (
                    <div
                      key={stage.id}
                      className={`flex items-center space-x-3 p-4 rounded-lg transition-all duration-300 border ${
                        isActive ? `bg-${stage.color}-50 border-${stage.color}-200` : 
                        isCompleted ? 'bg-green-50 border-green-200' : 
                        'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isActive ? `bg-${stage.color}-100` : 
                        isCompleted ? 'bg-green-100' : 
                        'bg-slate-200'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          isActive ? `text-${stage.color}-600` : 
                          isCompleted ? 'text-green-600' : 
                          'text-slate-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          isActive ? `text-${stage.color}-900` : 
                          isCompleted ? 'text-green-900' : 
                          'text-slate-700'
                        }`}>
                          {stage.label}
                        </h4>
                        {isActive && (
                          <p className={`text-sm text-${stage.color}-600 mt-1`}>{stage.description}</p>
                        )}
                      </div>
                      {isCompleted && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {isActive && (
                        <div className="w-6 h-6">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Personal Data Detection Results */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-slate-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Extracted Personal Data</h3>
                  <div className="text-sm text-slate-500">
                    {personalData.length} item{personalData.length !== 1 ? 's' : ''} detected
                  </div>
                </div>

                {personalData.length === 0 ? (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No personal data detected yet...</p>
                    <p className="text-xs text-slate-400 mt-1">AI analysis in progress</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {personalData.map((item, index) => (
                      <div key={index} className={`border rounded-lg p-4 ${getDataTypeColor(item.type)}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="mt-1">
                              {getDataTypeIcon(item.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-semibold capitalize">{item.type.replace('_', ' ')}</span>
                                <span className="text-xs px-2 py-1 bg-white bg-opacity-60 rounded-full">
                                  {Math.round(item.confidence * 100)}% confidence
                                </span>
                              </div>
                              <p className="font-mono text-sm break-all">{item.value}</p>
                              <div className="text-xs mt-2 opacity-75">
                                Position: x:{item.position.x}, y:{item.position.y} | 
                                Size: {item.position.width}×{item.position.height}px
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-medium mb-1">Risk Level</div>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              item.confidence > 0.9 ? 'bg-red-200 text-red-800' :
                              item.confidence > 0.8 ? 'bg-amber-200 text-amber-800' :
                              'bg-yellow-200 text-yellow-800'
                            }`}>
                              {item.confidence > 0.9 ? 'High' : item.confidence > 0.8 ? 'Medium' : 'Low'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Data Summary */}
                    <div className="bg-white rounded-lg p-4 border border-slate-200 mt-6">
                      <h4 className="font-medium text-slate-900 mb-3">Detection Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['name', 'email', 'phone', 'address', 'date', 'ssn', 'id_number'].map(type => {
                          const count = personalData.filter(item => item.type === type).length;
                          return (
                            <div key={type} className="text-center">
                              <div className="text-lg font-bold text-slate-900">{count}</div>
                              <div className="text-xs text-slate-500 capitalize">{type.replace('_', ' ')}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* File Preview with Redaction Overlay */}
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Document Preview</h3>
                
                {previewUrl && file.type.startsWith('image/') ? (
                  <div className="relative bg-white rounded-lg border border-slate-200 p-4">
                    <img 
                      src={previewUrl} 
                      alt="Document preview"
                      className="w-full max-h-96 object-contain rounded-lg"
                    />
                    
                    {/* Redaction Overlays */}
                    {personalData.map((item, index) => (
                      <div
                        key={index}
                        className="absolute bg-black bg-opacity-80 rounded border-2 border-red-400 animate-pulse"
                        style={{
                          left: `${(item.position.x / 600) * 100}%`,
                          top: `${(item.position.y / 800) * 100}%`,
                          width: `${(item.position.width / 600) * 100}%`,
                          height: `${(item.position.height / 800) * 100}%`,
                        }}
                        title={`Redacted: ${item.type} - ${item.value}`}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">REDACTED</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
                    <File className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Document preview not available for this file type</p>
                    <p className="text-xs text-slate-400 mt-1">Processing will continue normally</p>
                  </div>
                )}
              </div>

              {/* Current Stage Details */}
              {currentStageData.length > 0 && processingStage !== 'complete' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-blue-900">
                      Latest Detection - {stages.find(s => s.id === processingStage)?.label}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {currentStageData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                        <div className="flex items-center space-x-2">
                          {getDataTypeIcon(item.type)}
                          <span className="font-medium text-slate-900 capitalize">{item.type}</span>
                          <span className="text-slate-600">→</span>
                          <code className="text-sm bg-slate-100 px-2 py-1 rounded">{item.value}</code>
                        </div>
                        <span className="text-xs font-medium text-blue-600">
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Processing Complete */}
              {processingStage === 'complete' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900">Processing Complete!</h3>
                      <p className="text-green-700 text-sm">
                        All personal information has been successfully detected and redacted
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={downloadRedactedFile}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Redacted File</span>
                    </button>
                    
                    <button 
                      onClick={downloadEncryptedFile}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Download Encrypted File</span>
                    </button>
                  </div>

                  <div className="mt-4 p-4 bg-white rounded border border-green-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-green-600">{personalData.length}</div>
                        <div className="text-xs text-green-700">Items Redacted</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          {Math.round((personalData.filter(item => item.confidence > 0.9).length / personalData.length) * 100) || 0}%
                        </div>
                        <div className="text-xs text-green-700">High Confidence</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          {file.processingTime ? Math.round(file.processingTime / 1000) : 0}s
                        </div>
                        <div className="text-xs text-green-700">Processing Time</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};