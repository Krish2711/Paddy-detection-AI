import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, AlertCircle, CheckCircle2, Loader2, Sparkles, Camera } from 'lucide-react';

interface ImageUploaderProps {
  onAnalyze: (file: File) => void;
  isLoading: boolean;
  error?: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onAnalyze,
  isLoading,
  error
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setLocalError(null);

    if (!file.type.startsWith('image/')) {
      setLocalError('Please upload a valid image file (.jpg, .jpeg, .png, .webp).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setLocalError('File size exceeds the 10MB limit. Please select a smaller image.');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setLocalError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyzeClick = () => {
    if (selectedFile) {
      onAnalyze(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* Upload & Dropzone Area */}
      {!previewUrl ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragOver
              ? 'border-paddy-500 bg-paddy-50 dark:bg-paddy-950/40 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 hover:border-paddy-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/bmp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />

          <div className="w-16 h-16 mx-auto rounded-2xl bg-paddy-100 dark:bg-paddy-950 flex items-center justify-center text-paddy-600 dark:text-paddy-400 mb-4 shadow-inner">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            Drag & Drop Paddy Leaf Photo
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            or <span className="text-paddy-600 dark:text-paddy-400 font-semibold underline underline-offset-2">browse files</span> from your computer or phone
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <Camera className="w-3.5 h-3.5 text-paddy-500" />
            <span>Supported: JPG, PNG, WEBP (Max 10MB)</span>
          </div>
        </div>
      ) : (
        /* Image Preview Box */
        <div className="glass-panel rounded-3xl p-6 shadow-xl relative border border-slate-200 dark:border-slate-800">
          <div className="relative group rounded-2xl overflow-hidden bg-slate-950 max-h-96 flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Leaf Preview"
              className="max-h-96 w-full object-contain rounded-2xl"
            />
            
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-lg disabled:opacity-50"
              title="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                {selectedFile?.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : 0} MB
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Change Photo
              </button>
              
              <button
                onClick={handleAnalyzeClick}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-paddy-600 hover:bg-paddy-700 text-white font-semibold text-sm shadow-lg shadow-paddy-600/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing CNN...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Image</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {(error || localError) && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error || localError}</span>
        </div>
      )}

      {/* Photo Quality Advice Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-paddy-500 shrink-0 mt-0.5" />
          <span>Capture clear, focused close-up of infected leaf.</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-paddy-500 shrink-0 mt-0.5" />
          <span>Use good daylight; avoid dark shadows.</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-paddy-500 shrink-0 mt-0.5" />
          <span>Flat leaf view yields highest CNN accuracy.</span>
        </div>
      </div>

    </div>
  );
};
