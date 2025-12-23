import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, CheckCircle } from "lucide-react";

interface ImageUploaderProps {
  label: string;
  value?: string;
  onChange: (base64: string | undefined) => void;
}

export function ImageUploader({ label, value, onChange }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onChange(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-border bg-card aspect-video">
          <img 
            src={value} 
            alt="Preview" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            relative cursor-pointer group
            border-2 border-dashed rounded-xl p-8
            flex flex-col items-center justify-center gap-3
            transition-all duration-200
            ${isDragging 
              ? "border-primary bg-primary/5" 
              : "border-muted-foreground/20 hover:border-primary/50 hover:bg-card/50"
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          
          <div className="p-4 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
            <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Click to upload {label}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              or drag and drop image file
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
