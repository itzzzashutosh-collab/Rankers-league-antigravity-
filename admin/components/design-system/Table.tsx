"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { Button } from "./Button";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  pageSize?: number;
}

export function Table<T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
  pageSize = 10
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(columns.map(c => c.key));
  const [showConfig, setShowConfig] = useState(false);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="space-y-4 font-sans text-xs select-text">
      {/* Table settings bar */}
      <div className="flex justify-between items-center bg-card/25 px-4 py-2 border border-border rounded-xl">
        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
          Registry: {data.length} records
        </span>
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Settings className="w-3.5 h-3.5" />}
            onClick={() => setShowConfig(!showConfig)}
          >
            Columns
          </Button>

          {showConfig && (
            <div className="absolute right-0 mt-1.5 w-40 rounded-lg border border-border bg-card p-2 shadow-lg z-50 space-y-1.5">
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block px-1">
                Visible Columns
              </span>
              <div className="divide-y divide-border/20 max-h-40 overflow-y-auto">
                {columns.map(col => (
                  <label key={col.key} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/40 rounded cursor-pointer font-semibold text-[10px]">
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(col.key)}
                      onChange={() => toggleColumn(col.key)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span>{col.header}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Table Grid Container */}
      <div className="overflow-x-auto border border-border rounded-xl bg-card/5">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-[9px] font-black uppercase tracking-wider text-muted-foreground bg-muted/20">
              {columns
                .filter(col => visibleColumns.includes(col.key))
                .map(col => (
                  <th key={col.key} className="p-4 font-black" style={{ width: col.width }}>
                    {col.header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-semibold">
            {paginatedData.map((row, idx) => (
              <tr
                key={row.id || idx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors ${onRowClick ? "hover:bg-muted/40 cursor-pointer" : ""}`}
              >
                {columns
                  .filter(col => visibleColumns.includes(col.key))
                  .map(col => (
                    <td key={col.key} className="p-4 text-foreground/90 font-medium">
                      {col.render ? col.render(row) : String(row[col.key as keyof T] || "")}
                    </td>
                  ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-muted-foreground font-bold">
                  No records matching parameters found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-muted-foreground font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
