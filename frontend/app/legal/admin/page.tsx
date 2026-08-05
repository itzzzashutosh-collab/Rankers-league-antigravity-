"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Search,
  Plus,
  Edit3,
  Eye,
  CheckCircle,
  Clock,
  Archive,
  History,
  Languages,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Save,
  Trash2,
  Check,
  X,
  Filter,
  ShieldAlert,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import legalCmsService, { type CMSLegalDocument, type DocumentStatus, type LegalCMSSection } from "@/services/legalCmsService";

export default function LegalCMSAdminPage() {
  const [documents, setDocuments] = useState<CMSLegalDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<"All" | DocumentStatus>("All");
  
  // Editor modal state
  const [editingDoc, setEditingDoc] = useState<CMSLegalDocument | null>(null);
  const [isNewRevisionModalOpen, setIsNewRevisionModalOpen] = useState(false);
  const [revisionDocId, setRevisionDocId] = useState<string | null>(null);
  const [newVersionString, setNewVersionString] = useState("");
  const [revisionSummary, setRevisionSummary] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load documents on mount
  useEffect(() => {
    loadCMSDocuments();
  }, []);

  const loadCMSDocuments = () => {
    setDocuments(legalCmsService.getAllDocuments());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered documents
  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || doc.status === selectedStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || doc.title.toLowerCase().includes(q) || doc.slug.toLowerCase().includes(q);
    return matchesCategory && matchesStatus && matchesQuery;
  });

  // Calculate statistics
  const stats = {
    total: documents.length,
    published: documents.filter((d) => d.status === "published").length,
    drafts: documents.filter((d) => d.status === "draft").length,
    archived: documents.filter((d) => d.status === "archived").length,
  };

  // Save document from editor
  const handleSaveDoc = () => {
    if (!editingDoc) return;
    legalCmsService.saveDocument(editingDoc);
    loadCMSDocuments();
    setEditingDoc(null);
    showToast(`Document "${editingDoc.title}" saved successfully!`);
  };

  // Toggle status (Published <-> Draft <-> Archived)
  const handleStatusChange = (docId: string, status: DocumentStatus) => {
    legalCmsService.setDocumentStatus(docId, status);
    loadCMSDocuments();
    showToast(`Document status updated to ${status.toUpperCase()}`);
  };

  // Submit new revision
  const handleCreateRevision = () => {
    if (!revisionDocId || !newVersionString || !revisionSummary) return;
    legalCmsService.createRevision(revisionDocId, newVersionString, revisionSummary);
    loadCMSDocuments();
    setIsNewRevisionModalOpen(false);
    setRevisionDocId(null);
    setNewVersionString("");
    setRevisionSummary("");
    showToast(`New revision ${newVersionString} created successfully!`);
  };

  // Reset CMS back to factory defaults
  const handleResetDefaults = () => {
    if (confirm("Reset all Legal CMS documents back to default initial state?")) {
      legalCmsService.resetToDefaults();
      loadCMSDocuments();
      showToast("CMS reset to factory defaults!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-x-hidden">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-2xl flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Header />

      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          
          {/* Header & Stats Banner */}
          <div className="flex flex-wrap items-center justify-between gap-6 p-8 rounded-3xl border border-border/50 bg-gradient-to-br from-card via-card/80 to-background shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Link
                  href="/legal"
                  className="p-1.5 rounded-lg border border-border/50 bg-card/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                  Legal CMS Studio
                </span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Legal Document Management
              </h1>
              <p className="text-sm text-muted-foreground max-w-xl">
                Edit policy documents, publish revisions, toggle English/Hindi translations, and manage status without code changes.
              </p>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-3 rounded-2xl border border-border/40 bg-card/50 text-center min-w-[90px]">
                <span className="block text-2xl font-extrabold font-mono text-foreground">{stats.total}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total</span>
              </div>
              <div className="px-4 py-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-center min-w-[90px]">
                <span className="block text-2xl font-extrabold font-mono text-emerald-500">{stats.published}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Published</span>
              </div>
              <div className="px-4 py-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-center min-w-[90px]">
                <span className="block text-2xl font-extrabold font-mono text-amber-500">{stats.drafts}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Drafts</span>
              </div>
              <div className="px-4 py-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-center min-w-[90px]">
                <span className="block text-2xl font-extrabold font-mono text-rose-500">{stats.archived}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Archived</span>
              </div>
            </div>
          </div>

          {/* Search, Filters & Action Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md">
            
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search legal documents by title or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-background/80 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border border-border/30 text-xs">
              {(["All", "published", "draft", "archived"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1 rounded-lg font-bold capitalize transition-all ${
                    selectedStatus === st
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Reset Defaults Button */}
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-border/50 bg-card/50 text-muted-foreground hover:text-foreground hover:border-border transition-all"
              title="Reset CMS to default data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>
          </div>

          {/* Document Management Table Grid */}
          <div className="rounded-3xl border border-border/40 bg-card/20 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/30 text-muted-foreground font-black uppercase tracking-wider">
                    <th className="py-3.5 px-6">Document Title & Slug</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Version</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Last Updated</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-muted/10 transition-colors">
                      {/* Title & Slug */}
                      <td className="py-4 px-6 space-y-1">
                        <div className="font-bold text-foreground text-sm flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary shrink-0" />
                          <span>{doc.title}</span>
                          {doc.titleHi && (
                            <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                              HI
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[11px] text-muted-foreground">
                          /legal/{doc.slug}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border border-primary/20 bg-primary/10 text-primary">
                          {doc.category}
                        </span>
                      </td>

                      {/* Version */}
                      <td className="py-4 px-4">
                        <span className="font-mono text-xs font-bold text-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/40">
                          {doc.version}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize border ${
                            doc.status === "published"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                              : doc.status === "draft"
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                              : "bg-rose-500/10 border-rose-500/30 text-rose-500"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>

                      {/* Last Updated */}
                      <td className="py-4 px-4 text-muted-foreground">
                        {doc.lastUpdated}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* Preview Page */}
                          <Link
                            href={`/legal/${doc.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg border border-border/50 bg-card/40 text-muted-foreground hover:text-foreground hover:border-border transition-all"
                            title="Preview Document Reader"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          {/* Edit Button */}
                          <button
                            onClick={() => setEditingDoc({ ...doc })}
                            className="p-1.5 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                            title="Edit Document Content"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* New Revision */}
                          <button
                            onClick={() => {
                              setRevisionDocId(doc.id);
                              setNewVersionString(`v${(parseFloat(doc.version.replace("v", "")) + 0.1).toFixed(1)}`);
                              setIsNewRevisionModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-border/50 bg-card/40 text-muted-foreground hover:text-foreground hover:border-border transition-all"
                            title="Create New Revision Log"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>

                          {/* Status Toggle Dropdown */}
                          <select
                            value={doc.status}
                            onChange={(e) => handleStatusChange(doc.id, e.target.value as DocumentStatus)}
                            className="text-[10px] font-bold bg-background border border-border/50 rounded-lg px-2 py-1 text-foreground focus:outline-none"
                          >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                          </select>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* ── Document Editor Modal Drawer ─────────────────────────────────── */}
      <AnimatePresence>
        {editingDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl max-h-[90vh] bg-background border border-border/50 rounded-3xl p-6 sm:p-8 space-y-6 overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border/30 pb-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold font-heading text-foreground">
                    Editing: {editingDoc.title}
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">ID: {editingDoc.id}</span>
                </div>
                <button
                  onClick={() => setEditingDoc(null)}
                  className="p-2 rounded-xl border border-border/40 hover:bg-muted text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">English Title</label>
                  <input
                    type="text"
                    value={editingDoc.title}
                    onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-border/50 bg-card text-foreground"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Hindi Title (हिन्दी)</label>
                  <input
                    type="text"
                    value={editingDoc.titleHi || ""}
                    onChange={(e) => setEditingDoc({ ...editingDoc, titleHi: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-border/50 bg-card text-foreground"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">URL Slug</label>
                  <input
                    type="text"
                    value={editingDoc.slug}
                    onChange={(e) => setEditingDoc({ ...editingDoc, slug: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-border/50 bg-card text-foreground font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Version Tag</label>
                  <input
                    type="text"
                    value={editingDoc.version}
                    onChange={(e) => setEditingDoc({ ...editingDoc, version: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-border/50 bg-card text-foreground font-mono"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-foreground">English Short Description</label>
                <textarea
                  rows={3}
                  value={editingDoc.shortDescription}
                  onChange={(e) => setEditingDoc({ ...editingDoc, shortDescription: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-border/50 bg-card text-foreground"
                />
              </div>

              {/* Sections Editor */}
              <div className="space-y-4 pt-4 border-t border-border/30">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground">Policy Sections ({editingDoc.sections.length})</h4>
                  <button
                    onClick={() => {
                      const newSec: LegalCMSSection = {
                        id: `section-${editingDoc.sections.length + 1}`,
                        title: `New Section ${editingDoc.sections.length + 1}`,
                        content: "Enter section content here...",
                      };
                      setEditingDoc({ ...editingDoc, sections: [...editingDoc.sections, newSec] });
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Section
                  </button>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {editingDoc.sections.map((sec, idx) => (
                    <div key={sec.id || idx} className="p-4 rounded-2xl border border-border/40 bg-card/30 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => {
                            const updated = [...editingDoc.sections];
                            updated[idx].title = e.target.value;
                            setEditingDoc({ ...editingDoc, sections: updated });
                          }}
                          className="font-bold text-foreground bg-transparent border-b border-border/40 focus:border-primary p-1 w-3/4"
                        />
                        <button
                          onClick={() => {
                            const updated = editingDoc.sections.filter((_, i) => i !== idx);
                            setEditingDoc({ ...editingDoc, sections: updated });
                          }}
                          className="text-rose-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={sec.content}
                        onChange={(e) => {
                          const updated = [...editingDoc.sections];
                          updated[idx].content = e.target.value;
                          setEditingDoc({ ...editingDoc, sections: updated });
                        }}
                        className="w-full p-2 rounded-xl border border-border/30 bg-background text-foreground"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/30">
                <button
                  onClick={() => setEditingDoc(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-border/50 hover:bg-muted text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDoc}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                >
                  <Save className="w-4 h-4" /> Save Policy
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── New Revision Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isNewRevisionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-background border border-border/50 rounded-3xl p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border/30 pb-3">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" /> Create Revision Log
                </h3>
                <button onClick={() => setIsNewRevisionModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">New Version Tag</label>
                  <input
                    type="text"
                    value={newVersionString}
                    onChange={(e) => setNewVersionString(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border/50 bg-card text-foreground font-mono"
                    placeholder="e.g. v3.2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Revision Changelog Summary</label>
                  <textarea
                    rows={3}
                    value={revisionSummary}
                    onChange={(e) => setRevisionSummary(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border/50 bg-card text-foreground"
                    placeholder="Describe what changed in this revision..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/30">
                <button
                  onClick={() => setIsNewRevisionModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-border/50 text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRevision}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Publish Revision
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
