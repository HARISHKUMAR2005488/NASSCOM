import React from 'react';
import { File, Download, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { FileItem } from '../types';

interface DashboardProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ files, onFileSelect }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Processing Dashboard</h2>
          <p className="text-slate-600 mt-2">Manage and monitor your document processing queue</p>
        </div>
        
        <div className="flex space-x-4 text-sm">
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200">
            <span className="text-slate-600">Total Files:</span>
            <span className="font-bold text-slate-900 ml-2">{files.length}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200">
            <span className="text-slate-600">Completed:</span>
            <span className="font-bold text-green-600 ml-2">
              {files.filter(f => f.status === 'completed').length}
            </span>
          </div>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <File className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-900 mb-2">No files processed yet</h3>
          <p className="text-slate-500">Upload your first document to get started with AI-powered deidentification.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <File className="w-6 h-6 text-slate-500" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{file.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      <span>{file.uploadedAt.toLocaleDateString()}</span>
                      {file.personalDataFound.length > 0 && (
                        <span className="text-amber-600 font-medium">
                          {file.personalDataFound.length} items detected
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(file.status)}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                      {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => onFileSelect(file)}
                      className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">View</span>
                    </button>
                    
                    {file.status === 'completed' && (
                      <button className="flex items-center space-x-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Download</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {file.status === 'processing' && (
                <div className="mt-4">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${file.processingProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {file.personalDataFound.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-slate-900 mb-2">Detected Personal Data</h4>
                  <div className="flex flex-wrap gap-2">
                    {file.personalDataFound.map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                      >
                        {item.type}: {item.value.substring(0, 15)}...
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};