import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Image as ImageIcon, X, AlertCircle, CheckCircle2, 
  Loader2, Sparkles, Camera, Crop, ZoomIn, RotateCcw, Layers, ArrowRight
} from 'lucide-react';

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
  const [cropPreset, setCropPreset] = useState<'full' | 'center' | 'macro'>('full');
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (file: File) => {
    setLocalError(null);

    if (!file.type.startsWith('image/')) {
      setLocalError('Please upload a valid image file (.jpg, .jpeg, .png, .webp).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setLocalError('File size exceeds 10MB limit. Please select a smaller photo.');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Measure dimensions
    const img = new Image();
    img.onload = () => {
      setImageMeta({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = url;
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
    setImageMeta(null);
    setCropPreset('full');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Perform client-side crop to canvas before submission if preset selected
  const handleAnalyzeClick = async () => {
    if (!selectedFile || !previewUrl) return;

    if (cropPreset === 'full') {
      onAnalyze(selectedFile);
      return;
    }

    // Crop via canvas
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        onAnalyze(selectedFile);
        return;
      }

      const w = img.naturalWidth;
      const h = img.naturalHeight;

      let cropFactor = 0.8;
      if (cropPreset === 'macro') cropFactor = 0.65;

      const cropW = w * cropFactor;
      const cropH = h * cropFactor;
      const startX = (w - cropW) / 2;
      const startY = (h - cropH) / 2;

      canvas.width = 224;
      canvas.height = 224;

      ctx.drawImage(img, startX, startY, cropW, cropH, 0, 0, 224, 224);

      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], `cropped_${selectedFile.name}`, { type: 'image/jpeg' });
          onAnalyze(croppedFile);
        } else {
          onAnalyze(selectedFile);
        }
      }, 'image/jpeg', 0.95);
    };
    img.src = previewUrl;
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
      {/* Upload Zone */}
      {!previewUrl ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-300 ${
            isDragOver
              ? 'border-emerald-400 bg-emerald-950/30 scale-[1.01]'
              : 'border-white/10 glass-panel hover:border-emerald-500/50 hover:bg-white/5'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/bmp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) handleFileSelect(e.target.files[0]);
            }}
          />

          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-black mb-5 shadow-lg shadow-emerald-500/20">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
            Select or Drag Leaf Photograph
          </h3>
          <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto leading-relaxed">
            Upload high-resolution phone captures or macro leaf snapshots for biological CNN classification.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 text-[11px] font-mono text-emerald-400">
            <Camera className="w-3.5 h-3.5" />
            <span>Supported: JPG, PNG, WEBP • Max 10MB</span>
          </div>
        </div>
      ) : (
        /* Interactive Inspection & Cropping Workbench */
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-emerald-500/30 relative shadow-2xl">
          
          {/* Top Workbench Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400">Specimen Preview</span>
              {imageMeta && (
                <span className="text-[11px] font-mono text-slate-400 bg-black/40 px-2 py-0.5 rounded-md border border-white/5">
                  {imageMeta.width} × {imageMeta.height} px
                </span>
              )}
            </div>

            {/* Crop Mode Selector */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
              <span className="px-2 text-[10px] uppercase font-mono text-slate-400">Focus Mode:</span>
              <button
                onClick={() => setCropPreset('full')}
                className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${cropPreset === 'full' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                Full Image
              </button>
              <button
                onClick={() => setCropPreset('center')}
                className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${cropPreset === 'center' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-300 hover:text-white'}`}
                title="Isolates leaf from outer borders"
              >
                Center Crop (80%)
              </button>
              <button
                onClick={() => setCropPreset('macro')}
                className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${cropPreset === 'macro' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-300 hover:text-white'}`}
                title="Zoom into lesion spots"
              >
                Macro Lesion (65%)
              </button>
            </div>
          </div>

          {/* Image Viewport */}
          <div className="relative rounded-2xl overflow-hidden bg-black/90 max-h-96 flex items-center justify-center border border-white/10 group">
            <img
              src={previewUrl}
              alt="Leaf Specimen"
              className={`max-h-96 w-full object-contain transition-transform duration-300 ${
                cropPreset === 'center' ? 'scale-125' : cropPreset === 'macro' ? 'scale-150' : 'scale-100'
              }`}
            />

            {/* Target Reticle if cropped */}
            {cropPreset !== 'full' && (
              <div className="absolute inset-8 border-2 border-dashed border-emerald-400/60 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="bg-black/80 px-2 py-1 rounded-md text-[10px] font-mono text-emerald-300 border border-emerald-500/40">
                  Target Lesion Viewport
                </span>
              </div>
            )}

            <button
              onClick={handleClear}
              disabled={isLoading}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors border border-white/10 disabled:opacity-40"
              title="Remove photo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div>
              <p className="font-bold text-xs text-white truncate max-w-xs">{selectedFile?.name}</p>
              <p className="text-[11px] font-mono text-slate-400">
                {selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : 0} MB
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Change Image
              </button>

              <button
                onClick={handleAnalyzeClick}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Executing CNN Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Disease Analysis</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Error Message */}
      {(error || localError) && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error || localError}</span>
        </div>
      )}

    </div>
  );
};
