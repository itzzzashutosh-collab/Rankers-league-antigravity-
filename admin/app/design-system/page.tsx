"use client";

import React, { useState } from "react";
import { Button, DropdownButton, SplitButton } from "@/components/design-system/Button";
import { TextInput, Textarea, SearchInput, OTPInput, Select, DatePicker } from "@/components/design-system/Input";
import { FormField, FormSection } from "@/components/design-system/Form";
import { Table, Column } from "@/components/design-system/Table";
import { Timeline, CommentList, TimelineEvent, CommentItem } from "@/components/design-system/List";
import { Dialog, Drawer } from "@/components/design-system/Dialog";
import { Badge, StatusDot, Chip, Progress } from "@/components/design-system/Status";
import { EmptyState, ErrorState, TableLoadingSkeleton } from "@/components/design-system/State";
import { Sparkles, HelpCircle, Activity, Key, Cpu, ShieldCheck } from "lucide-react";

interface DemoData {
  id: string;
  name: string;
  category: string;
  seats: number;
  status: "Live" | "Draft" | "Pending";
}

export default function DesignSystemShowcase() {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [selectVal, setSelectVal] = useState("jee");
  const [multiSelectVal, setMultiSelectVal] = useState(["eng"]);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Mock table data
  const tableData: DemoData[] = [
    { id: "c-1", name: "UPSC Prelims Mock Arena", category: "Civil Services", seats: 12000, status: "Live" },
    { id: "c-2", name: "JEE Advanced Physics Sprint", category: "Engineering", seats: 4500, status: "Draft" },
    { id: "c-3", name: "NEET Biology Grand Test", category: "Medical", seats: 8900, status: "Pending" }
  ];

  const tableColumns: Column<DemoData>[] = [
    { key: "name", header: "Contest Arena Name" },
    { key: "category", header: "Exam Category" },
    {
      key: "seats",
      header: "Seat Capacity",
      render: (r) => <span className="font-mono">{r.seats.toLocaleString()} seats</span>
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge variant={r.status === "Live" ? "success" : r.status === "Pending" ? "warning" : "neutral"}>
          {r.status}
        </Badge>
      )
    }
  ];

  // Timeline events
  const timelineEvents: TimelineEvent[] = [
    { id: "1", label: "Prize distribution ledger re-initialized", date: "Today 2:30 PM", actor: "Ashutosh", type: "success" },
    { id: "2", label: "Anomaly detected in IP routing logs", date: "Today 1:15 PM", actor: "System", type: "error" },
    { id: "3", label: "Drafted test syllabus optimization blueprint", date: "Yesterday 5:40 PM", actor: "CTO_Agent", type: "ai" }
  ];

  // Comment thread
  const commentItems: CommentItem[] = [
    { id: "1", author: "Ashutosh Admin", content: "We need to re-verify NEET Biology Section D answer keys before releasing scores.", time: "2h ago" },
    { id: "2", author: "Digital CEO", content: "Understood. The QA review pipeline has been scheduled for verification.", time: "1h ago" }
  ];

  return (
    <div className="space-y-12 pb-16 font-sans text-xs select-text text-foreground animate-fade-in max-w-5xl mx-auto">
      {/* Header banner */}
      <div className="border-b border-border/30 pb-6">
        <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
          Workspace UI Kit
        </span>
        <h1 className="text-xl font-black tracking-tight text-foreground mt-3">
          Ranker's League Complete Design System
        </h1>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Production-grade UI tokens, atomic component libraries, and visual presets. Built to maintain layout engine consistency across core workspace flows.
        </p>
      </div>

      {/* Grid spacing design system */}
      <section className="space-y-4">
        <h2 className="text-sm font-black text-foreground">1. Design Tokens & Palette Values</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card/15 space-y-2">
            <span className="text-[9px] text-muted-foreground uppercase font-black">Background Base</span>
            <div className="h-6 w-full rounded bg-background border border-border" />
            <span className="font-mono text-[9px] text-foreground font-bold">#fafafa / #09090b</span>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card/15 space-y-2">
            <span className="text-[9px] text-muted-foreground uppercase font-black">Card Panel Surface</span>
            <div className="h-6 w-full rounded bg-card border border-border" />
            <span className="font-mono text-[9px] text-foreground font-bold">#ffffff / #18181b</span>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card/15 space-y-2">
            <span className="text-[9px] text-muted-foreground uppercase font-black">Primary Charcoal</span>
            <div className="h-6 w-full rounded bg-primary" />
            <span className="font-mono text-[9px] text-foreground font-bold">#171717 / #fafafa</span>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card/15 space-y-2">
            <span className="text-[9px] text-muted-foreground uppercase font-black">Soft Border Grid</span>
            <div className="h-6 w-full rounded bg-border" />
            <span className="font-mono text-[9px] text-foreground font-bold">#e5e5e5 / #27272a</span>
          </div>
        </div>
      </section>

      {/* Button catalog */}
      <section className="space-y-4">
        <h2 className="text-sm font-black text-foreground">2. Button Components Library</h2>
        <div className="p-6 rounded-2xl border border-border bg-card/15 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" isLoading={loading}>Primary Action</Button>
            <Button variant="secondary" isLoading={loading}>Secondary</Button>
            <Button variant="outline" isLoading={loading}>Outline Frame</Button>
            <Button variant="ghost" isLoading={loading}>Ghost Key</Button>
            <Button variant="danger" isLoading={loading}>Danger Warning</Button>
            <Button variant="success" isLoading={loading}>Success Confirm</Button>
          </div>

          <div className="flex items-center gap-4 pt-3 border-t border-border/20">
            <label className="flex items-center gap-2 font-bold text-muted-foreground select-none cursor-pointer">
              <input type="checkbox" checked={loading} onChange={(e) => setLoading(e.target.checked)} className="rounded text-primary" />
              Toggle Loading State
            </label>

            <DropdownButton
              label="More Actions"
              items={[
                { label: "Duplicate Draft", onClick: () => alert("Duplicate") },
                { label: "Archive Registry", onClick: () => alert("Archive") }
              ]}
            />

            <SplitButton
              label="Save Changes"
              onClick={() => alert("Saved")}
              items={[
                { label: "Save and Publish", onClick: () => alert("Save & Publish") },
                { label: "Export as CSV", onClick: () => alert("Export") }
              ]}
            />
          </div>
        </div>
      </section>

      {/* Form System layout inputs */}
      <section className="space-y-4">
        <h2 className="text-sm font-black text-foreground">3. Form Input & Verification Validation</h2>
        <div className="p-6 rounded-2xl border border-border bg-card/15">
          <FormSection title="Create New Arena Parameters" description="Define seat brackets, category structures, and exam rules tags.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Contest Name Reference" required hint="Example: UPSC Civil Services Mock Prelims Section A">
                <TextInput placeholder="Enter reference name..." />
              </FormField>

              <FormField label="Launch Date Picker" required>
                <DatePicker />
              </FormField>

              <FormField label="Select Single Category" required>
                <Select
                  options={[
                    { label: "JEE Engineering", value: "jee", group: "Academics" },
                    { label: "NEET Medical Entrance", value: "neet", group: "Academics" },
                    { label: "UPSC Civil Services", value: "upsc", group: "Government" }
                  ]}
                  value={selectVal}
                  onChange={setSelectVal}
                  isSearchable
                />
              </FormField>

              <FormField label="Select Multi Categories">
                <Select
                  options={[
                    { label: "Physics", value: "phy" },
                    { label: "Chemistry", value: "chm" },
                    { label: "Biology", value: "bio" },
                    { label: "General Knowledge", value: "gk" }
                  ]}
                  value={multiSelectVal}
                  onChange={setMultiSelectVal}
                  isMulti
                />
              </FormField>
            </div>

            <FormField label="Verify OTP/Phone verification code" hint="Enter the 6 digit code sent to validation node.">
              <OTPInput value={otp} onChange={setOtp} />
            </FormField>

            <FormField label="Detailed Exam Instructions Note" maxCharCount={100} charCount={0}>
              <Textarea placeholder="Explain contest rules, marks distribution ratios, and evaluation pipeline settings..." rows={3} />
            </FormField>
          </FormSection>
        </div>
      </section>

      {/* Table grid system */}
      <section className="space-y-4">
        <h2 className="text-sm font-black text-foreground">4. Workspace Table & Registry Grid</h2>
        <Table columns={tableColumns} data={tableData} onRowClick={(r) => alert(`Inspected object: ${r.name}`)} />
      </section>

      {/* Dialogs and drawer overlays console */}
      <section className="space-y-4">
        <h2 className="text-sm font-black text-foreground">5. Modal Overlays & Drawers Sheets</h2>
        <div className="p-6 rounded-2xl border border-border bg-card/15 flex gap-3">
          <Button variant="outline" onClick={() => setModalOpen(true)}>Open Dialog Modal</Button>
          <Button variant="outline" onClick={() => setDrawerOpen(true)}>Open Side Inspector Drawer</Button>

          <Dialog
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="System Evaluation Checkpoint"
            footer={
              <>
                <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button onClick={() => setModalOpen(false)}>Confirm Release</Button>
              </>
            }
          >
            <p className="font-semibold text-foreground/80 leading-relaxed">
              Confirm Score Grader publication? This action will distribute ₹5,20,400 to the wallet ledgers of 1,209 qualified candidate ranks.
            </p>
          </Dialog>

          <Drawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Inspector: NEET Biology sprint"
            footer={
              <Button onClick={() => setDrawerOpen(false)} className="w-full">
                Close Panel
              </Button>
            }
          >
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 space-y-1.5">
                <span className="text-[9px] text-primary uppercase font-black flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> AI Prediction</span>
                <p className="text-[10px] leading-relaxed">Completion metrics for this template indicate high active participant conversion trends.</p>
              </div>
              <Timeline events={timelineEvents} />
            </div>
          </Drawer>
        </div>
      </section>

      {/* Timelines and comments log lists */}
      <section className="space-y-4">
        <h2 className="text-sm font-black text-foreground">6. Feeds & History Timelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card/15 space-y-4">
            <h3 className="font-black text-sm text-foreground">Platform Event Stream</h3>
            <Timeline events={timelineEvents} />
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card/15 space-y-4">
            <h3 className="font-black text-sm text-foreground">Audit Comments Log</h3>
            <CommentList comments={commentItems} />
          </div>
        </div>
      </section>

      {/* Skeletons and Empty/Error modules */}
      <section className="space-y-4">
        <h2 className="text-sm font-black text-foreground">7. Empty, Loading, and System Error Panels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <EmptyState
            title="No blueprints found"
            description="Build new mock test paper blueprints to feed the contest arenas generator."
            actionLabel="Create Blueprint"
            onAction={() => alert("Creating")}
          />

          <ErrorState
            title="API Network Fail"
            description="The connection to the billing gateway service timed out. Transaction sync paused."
            onRetry={() => alert("Retrying")}
          />

          <div className="p-4 rounded-2xl border border-border bg-card/15 space-y-4">
            <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest block">Skeletal Shimmer Load</span>
            <TableLoadingSkeleton rows={2} cols={3} />
          </div>
        </div>
      </section>
    </div>
  );
}
