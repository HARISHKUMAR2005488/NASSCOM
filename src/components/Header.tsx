import React from 'react';
import { Shield, Upload, BarChart3, Settings } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: 'upload' | 'dashboard' | 'processing' | 'settings') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">SecureRedact</h1>
              <p className="text-xs text-slate-500">AI-Powered Document Protection</p>
            </div>
          </div>

          <nav className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};