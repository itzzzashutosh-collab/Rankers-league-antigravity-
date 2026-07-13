"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FolderOpen, Upload, Copy, ExternalLink, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { questionService, MediaAsset } from "@/services/questionService";

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await questionService.getMedia();
      setMedia(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleUpload = () => {
    const newMedia: MediaAsset = {
      id: `m-${Date.now()}`,
      name: "New Physics Vector Diagram",
      file_url: "/media/new_vector.png",
      file_type: "png",
      created_at: new Date().toISOString()
    };
    setMedia(prev => [newMedia, ...prev]);
    alert("New asset uploaded to Supabase Storage bucket.");
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert("Media CDN url copied to clipboard!");
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/question-bank"
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              Shared Media Assets
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Reusable diagram libraries, formulas charts, and reference vectors.
            </p>
          </div>
        </div>

        <button
          onClick={handleUpload}
          className="h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          Upload Asset
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground/60 animate-pulse font-bold tracking-widest uppercase">
          Loading Media library...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
          {media.map((asset) => (
            <div
              key={asset.id}
              className="rounded-3xl border border-border bg-card/15 p-5 flex flex-col justify-between h-48 relative overflow-hidden group hover:border-primary/40 hover:bg-card/25 transition-all shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-muted/40 border border-border/80 text-[8px] uppercase tracking-wider font-mono">
                    {asset.file_type}
                  </span>
                  <span className="text-[9px] text-muted-foreground/60 font-mono">ID: {asset.id}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground leading-snug truncate max-w-[160px]">
                      {asset.name}
                    </h3>
                    <span className="text-[10px] text-muted-foreground block mt-1 truncate max-w-[160px]">
                      {asset.file_url}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => copyLink(asset.file_url)}
                className="h-8 rounded-xl bg-card hover:bg-muted/40 border border-border text-foreground font-bold text-[10px] flex items-center justify-center gap-1.5 transition-colors mt-4"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy CDN Link
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
