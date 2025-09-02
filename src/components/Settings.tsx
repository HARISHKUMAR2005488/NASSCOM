import React, { useState } from 'react';
import { Shield, Eye, Brain, FileText, Sliders, Save } from 'lucide-react';
import { RedactionSettings } from '../types';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<RedactionSettings>({
    blurIntensity: 10,
    redactionColor: '#000000',
    ocrEnabled: true,
    nlpEnabled: true,
    visionEnabled: true,
    encryptionEnabled: true,
    personalDataTypes: ['name', 'email', 'phone', 'ssn', 'address']
  });

  const personalDataOptions = [
    { id: 'name', label: 'Names', description: 'First and last names' },
    { id: 'email', label: 'Email Addresses', description: 'Email addresses and domains' },
    { id: 'phone', label: 'Phone Numbers', description: 'Phone and fax numbers' },
    { id: 'ssn', label: 'Social Security Numbers', description: 'SSN and national IDs' },
    { id: 'address', label: 'Addresses', description: 'Street addresses and locations' },
    { id: 'date', label: 'Dates', description: 'Birth dates and timestamps' },
    { id: 'id_number', label: 'ID Numbers', description: 'License and ID numbers' }
  ];

  const handleSave = () => {
    // In a real app, this would save to backend/localStorage
    console.log('Settings saved:', settings);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Redaction Settings</h2>
          <p className="text-slate-600">Configure AI processing and privacy protection preferences</p>
        </div>

        <div className="p-6 space-y-8">
          {/* AI Processing Modules */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">AI Processing Modules</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <label className="font-medium text-slate-900">OCR Processing</label>
                </div>
                <input
                  type="checkbox"
                  checked={settings.ocrEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, ocrEnabled: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <p className="text-sm text-slate-600 mt-2">Extract text from scanned documents</p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Brain className="w-5 h-5 text-green-500" />
                  <label className="font-medium text-slate-900">NLP Analysis</label>
                </div>
                <input
                  type="checkbox"
                  checked={settings.nlpEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, nlpEnabled: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <p className="text-sm text-slate-600 mt-2">Identify personal data in text</p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Eye className="w-5 h-5 text-purple-500" />
                  <label className="font-medium text-slate-900">Vision Processing</label>
                </div>
                <input
                  type="checkbox"
                  checked={settings.visionEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, visionEnabled: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <p className="text-sm text-slate-600 mt-2">Detect faces and visual identifiers</p>
              </div>
            </div>
          </div>

          {/* Redaction Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Redaction Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Blur Intensity
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={settings.blurIntensity}
                    onChange={(e) => setSettings(prev => ({ ...prev, blurIntensity: parseInt(e.target.value) }))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-slate-600 w-8">{settings.blurIntensity}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Redaction Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.redactionColor}
                    onChange={(e) => setSettings(prev => ({ ...prev, redactionColor: e.target.value }))}
                    className="w-12 h-10 rounded border border-slate-300"
                  />
                  <span className="text-sm text-slate-600">{settings.redactionColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Data Types */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Data Types to Detect</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalDataOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-3 p-3 border border-slate-200 rounded-lg">
                  <input
                    type="checkbox"
                    id={option.id}
                    checked={settings.personalDataTypes.includes(option.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSettings(prev => ({
                          ...prev,
                          personalDataTypes: [...prev.personalDataTypes, option.id]
                        }));
                      } else {
                        setSettings(prev => ({
                          ...prev,
                          personalDataTypes: prev.personalDataTypes.filter(type => type !== option.id)
                        }));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded mt-1"
                  />
                  <div className="flex-1">
                    <label htmlFor={option.id} className="font-medium text-slate-900 cursor-pointer">
                      {option.label}
                    </label>
                    <p className="text-sm text-slate-600">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium text-slate-900">File Encryption</h4>
                    <p className="text-sm text-slate-600">Encrypt processed files before download</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.encryptionEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, encryptionEnabled: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-slate-200">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};