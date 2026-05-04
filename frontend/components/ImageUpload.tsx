'use client';

import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Eraser } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  previewUrl: string;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  label?: string;
  className?: string;
  aspectRatio?: string;
}

export function ImageUpload({ 
  previewUrl, 
  onFileSelect, 
  onRemove, 
  label, 
  className,
  aspectRatio = "aspect-video"
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between items-center mb-1">
        <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">{label || 'Imagen'}</label>
        {previewUrl && (
          <button type="button" onClick={onRemove} className="text-[9px] font-bold text-[var(--danger)] flex items-center gap-1 hover:underline">
            <Eraser className="w-3 h-3" /> Eliminar
          </button>
        )}
      </div>
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group",
          aspectRatio,
          isDragging ? "border-[var(--accent)] bg-[var(--accent)]/5 scale-[1.02]" : "border-[var(--border2)] bg-[var(--card)] hover:border-[var(--accent)]"
        )}
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Upload className="w-8 h-8 text-white" />
            </div>
          </>
        ) : (
          <div className="text-center space-y-2">
            <ImageIcon className={cn("w-6 h-6 mx-auto transition-colors", isDragging ? "text-[var(--accent)]" : "text-[var(--muted)]")} />
            <p className={cn("text-[10px] font-bold uppercase tracking-widest", isDragging ? "text-[var(--accent)]" : "text-[var(--muted)]")}>
              {isDragging ? 'Suelta la imagen' : 'Click o arrastra'}
            </p>
          </div>
        )}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
}
