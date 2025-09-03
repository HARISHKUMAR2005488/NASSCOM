import React, { useCallback, useState } from 'react';
import { Upload, File, Image, AlertCircle, X, Play, Eye } from 'lucide-react';

interface UploadZoneProps {
  onFileUpload: (files: File[]) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setError(null);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/') || 
                         file.type === 'application/pdf' ||
                         file.type.includes('document');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) {
      setError('Please upload valid image or document files (max 50MB each)');
      return;
    }

    setPreviewFiles(validFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setPreviewFiles(selectedFiles);
    }
  };

  const removeFile = (index: number) => {
    setPreviewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startProcessing = () => {
    onFileUpload(previewFiles);
    setPreviewFiles([]);
  };

  const clearAll = () => {
    setPreviewFiles([]);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-500" />;
    }
    return <File className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Secure Document Deidentification
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Upload your documents and images to automatically detect and redact personal information 
          using advanced AI algorithms. Your data is processed securely and never stored permanently.
        </p>
      </div>

      {previewFiles.length === 0 ? (
        <>
          <div
            className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 ${
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
          >
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                  isDragOver ? 'bg-blue-100' : 'bg-slate-100'
                }`}>
                  <Upload className={`w-8 h-8 ${isDragOver ? 'text-blue-600' : 'text-slate-500'}`} />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Drag & drop your files here
              </h3>
              <p className="text-slate-500 mb-6">
                or click to browse from your computer
              </p>

              <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                <File className="w-5 h-5 mr-2" />
                Choose Files
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <Image className="w-5 h-5 text-blue-500" />
                <span>Images (JPG, PNG, GIF)</span>
              </div>
              <div className="flex items-center space-x-2">
                <File className="w-5 h-5 text-green-500" />
                <span>Documents (PDF, DOC, DOCX)</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span>Max 50MB per file</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">File Preview</h3>
                <p className="text-slate-600 mt-1">Review your files before processing</p>
              </div>
              <button
                onClick={clearAll}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4 mb-6">
              {previewFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex-shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900 truncate">{file.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{file.type}</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>

                  {file.type.startsWith('image/') && (
                    <div className="flex-shrink-0">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                        onLoad={(e) => {
                          // Clean up object URL after image loads
                          setTimeout(() => URL.revokeObjectURL((e.target as HTMLImageElement).src), 1000);
                        }}
                      />
                    </div>
                  )}

                  <button
                    onClick={() => removeFile(index)}
                    className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Processing Preview</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    The AI will analyze these files for personal information including names, emails, phone numbers, 
                    addresses, and other sensitive data. Detected information will be automatically redacted and blurred.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                <span className="font-medium">{previewFiles.length}</span> file{previewFiles.length !== 1 ? 's' : ''} ready for processing
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={clearAll}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={startProcessing}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Processing</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewFiles.length === 0 && (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 font-bold">OCR</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Text Recognition</h3>
            <p className="text-slate-600 text-sm">
              Advanced OCR technology extracts and identifies text content from scanned documents and images.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 font-bold">NLP</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Language Processing</h3>
            <p className="text-slate-600 text-sm">
              Natural Language Processing identifies names, addresses, phone numbers, and other sensitive data.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-600 font-bold">AI</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Vision Analysis</h3>
            <p className="text-slate-600 text-sm">
              Computer vision algorithms detect faces, signatures, and other visual personal identifiers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};