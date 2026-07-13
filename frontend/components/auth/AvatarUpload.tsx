"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Camera, Trash2, User } from "lucide-react";

interface AvatarUploadProps {
  currentUrl?: string | null;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => Promise<void>;
  isLoading?: boolean;
}

export function AvatarUpload({ currentUrl, onUpload, onRemove, isLoading }: AvatarUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(currentUrl || null);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setPreview(currentUrl || null);
  }, [currentUrl]);

  const processFile = async (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Only JPG, PNG and WebP images are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be under 2MB.");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    await onUpload(file);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await processFile(file);
  };

  const handleRemove = async () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    await onRemove();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar circle */}
      <div
        className={cn(
          "relative w-24 h-24 rounded-full border-2 overflow-hidden cursor-pointer transition-all duration-200 group",
          isDragging ? "border-primary scale-105 shadow-lg shadow-primary/20" : "border-border/50 hover:border-primary/50"
        )}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg border border-primary/20 transition-colors disabled:opacity-50"
        >
          <Camera className="w-3.5 h-3.5" />
          {preview ? "Change Photo" : "Upload Photo"}
        </button>
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-bold rounded-lg border border-destructive/20 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        )}
      </div>

      <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
        JPG, PNG or WebP · Max 2MB · Square photos recommended
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
export default AvatarUpload;
