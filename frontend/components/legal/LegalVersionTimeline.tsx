"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, GitCommit, Calendar, CheckCircle2, ChevronDown, ChevronUp, Tag, ShieldCheck } from "lucide-react";
import { type VersionLog } from "@/content/legal-center";

export interface VersionHistoryItem extends VersionLog {
  author?: string;
  isMajor?: boolean;
  detailedChanges?: string[];
}

interface LegalVersionTimelineProps {
  currentVersion: string;
  history: VersionHistoryItem[];
  className?: string;
}

export function LegalVersionTimeline({
  currentVersion,
  history,
  className = "",
}: LegalVersionTimelineProps) {
  const [expandedVersion, setExpandedVersion] = useState<string | null>(currentVersion);

  if (!history || history.length === 0) return null;

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border border-border/40 bg-card/30 backdrop-blur-md space-y-6 shadow-xl ${className}`}>
      
      {/* Header Title */}
      <div className="flex items-center justify-between border-b border-border/30 pb-4">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold font-heading text-foreground flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Document Version History & Audit Log
          </h3>
          <p className="text-xs text-muted-foreground">
            Complete revision history, change logs, and policy updates since platform launch.
          </p>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-bold font-mono border border-primary/20 bg-primary/10 text-primary">
          Current: {currentVersion}
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border/40">
        {history.map((item, idx) => {
          const isCurrent = item.version === currentVersion;
          const isExpanded = expandedVersion === item.version;

          return (
            <motion.div
              key={item.version}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="relative group"
            >
              {/* Timeline Node Icon */}
              <div
                className={`absolute -left-[27px] sm:-left-[35px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                  isCurrent
                    ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20"
                    : "bg-card border-border/60 text-muted-foreground group-hover:border-primary group-hover:text-primary"
                }`}
              >
                {isCurrent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <GitCommit className="w-3.5 h-3.5" />}
              </div>

              {/* Version Card Box */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isCurrent
                    ? "border-emerald-500/30 bg-emerald-500/5 shadow-md"
                    : "border-border/40 bg-card/20 hover:border-border/60"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-extrabold text-foreground">
                      Version {item.version}
                    </span>
                    
                    {isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                        Active Version
                      </span>
                    )}

                    {item.isMajor && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                        Major Release
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {item.date}
                    </span>
                    <button
                      onClick={() => setExpandedVersion(isExpanded ? null : item.version)}
                      className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                      title={isExpanded ? "Collapse Changelog" : "Expand Changelog"}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Summary text */}
                <p className="text-xs text-foreground/90 font-medium mt-2 leading-relaxed">
                  {item.summary}
                </p>

                {/* Expandable Changelog Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pt-3 mt-3 border-t border-border/30 space-y-2 text-xs text-muted-foreground overflow-hidden"
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-foreground">
                        <span className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-primary" /> Key Revisions & Additions
                        </span>
                        {item.author && (
                          <span className="font-mono text-muted-foreground text-[10px]">
                            Approved by: {item.author}
                          </span>
                        )}
                      </div>

                      {item.detailedChanges && item.detailedChanges.length > 0 ? (
                        <ul className="space-y-1.5 pl-2">
                          {item.detailedChanges.map((change, cIdx) => (
                            <li key={cIdx} className="flex items-start gap-2 leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[11px] text-muted-foreground italic">
                          Official governance update incorporating compliance and performance guidelines.
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}

export default LegalVersionTimeline;
