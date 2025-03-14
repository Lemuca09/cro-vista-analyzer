
import React, { useState, useRef } from 'react';
import { toast } from "sonner";
import { HeatmapFile, HeatmapType } from '@/utils/types';
import { Upload, X, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeatmapUploaderProps {
  heatmap: HeatmapFile;
  onUpdate: (updatedHeatmap: HeatmapFile) => void;
}

const HeatmapUploader: React.FC<HeatmapUploaderProps> = ({ heatmap, onUpdate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const heatmapTypeLabels: Record<HeatmapType, string> = {
    scroll: 'Scroll Heatmap',
    click: 'Click Heatmap',
    attention: 'Attention Heatmap'
  };
  
  const heatmapDescriptions: Record<HeatmapType, string> = {
    scroll: 'Shows how far users scroll down the page',
    click: 'Highlights areas where users are clicking the most',
    attention: 'Identifies sections that attract the most user focus'
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };
  
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };
  
  const processFile = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Create URL for the image
    const imageUrl = URL.createObjectURL(file);
    
    // Update the heatmap object
    onUpdate({
      ...heatmap,
      file,
      imageUrl,
      analyzed: true
    });
    
    toast.success(`${heatmapTypeLabels[heatmap.type]} uploaded successfully`);
  };
  
  const handleRemove = () => {
    // Release object URL to prevent memory leaks
    if (heatmap.imageUrl) {
      URL.revokeObjectURL(heatmap.imageUrl);
    }
    
    onUpdate({
      ...heatmap,
      file: null,
      imageUrl: null,
      analyzed: false
    });
    
    toast.info(`${heatmapTypeLabels[heatmap.type]} removed`);
  };
  
  const handleClick = () => {
    inputRef.current?.click();
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden border transition-all duration-200 hover:shadow-md animate-fade-in">
      <div className="px-5 py-4 border-b bg-slate-50">
        <h3 className="text-lg font-medium text-slate-900">{heatmapTypeLabels[heatmap.type]}</h3>
        <p className="text-sm text-slate-500 mt-1">{heatmapDescriptions[heatmap.type]}</p>
      </div>
      
      {!heatmap.imageUrl ? (
        <div
          className={cn(
            "p-6 flex flex-col items-center justify-center h-48 cursor-pointer transition-all duration-200",
            isDragging ? "bg-slate-100" : "bg-white",
          )}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <Upload className="h-5 w-5 text-slate-500" />
          </div>
          <p className="text-sm font-medium text-slate-700">
            Drag & drop or click to upload
          </p>
          <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB</p>
        </div>
      ) : (
        <div className="relative">
          <img
            src={heatmap.imageUrl}
            alt={`${heatmap.type} heatmap`}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-white bg-opacity-80 p-1 rounded-full hover:bg-opacity-100 transition-opacity"
          >
            <X className="h-4 w-4 text-slate-700" />
          </button>
        </div>
      )}
    </div>
  );
};

export default HeatmapUploader;
