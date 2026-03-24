"use client";

import { useMemo, useState } from "react";

type TimelineRow = { date: string; title: string; description: string };
type SourceRow = { title: string; url: string; type: string; publisher: string; date: string; note: string };

export function TimelineEditor({ name, initialValue }: { name: string; initialValue: string }) {
  const initialRows = useMemo(() => parseTimelineRows(initialValue), [initialValue]);
  const [rows, setRows] = useState<TimelineRow[]>(initialRows.length ? initialRows : [{ date: "", title: "", description: "" }]);

  const encoded = rows
    .map((row) => [row.date, row.title, row.description].map((item) => item.trim()).join(" | "))
    .filter((line) => line.replace(/\|/g, "").trim())
    .join("\n");

  return (
    <div className="grid gap-3">
      <input type="hidden" name={name} value={encoded} readOnly />
      {rows.map((row, index) => (
        <div key={index} className="grid gap-3 rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-4">
          <div className="grid gap-3 md:grid-cols-[180px_1fr]">
            <EditorField label="日期" value={row.date} onChange={(value) => updateRow(setRows, rows, index, { ...row, date: value })} placeholder="2024-05 或 2024-05-01" />
            <EditorField label="标题" value={row.title} onChange={(value) => updateRow(setRows, rows, index, { ...row, title: value })} placeholder="发生了什么" />
          </div>
          <EditorArea label="描述" value={row.description} onChange={(value) => updateRow(setRows, rows, index, { ...row, description: value })} placeholder="补充这一步的背景、影响、证据。" rows={3} />
          <div className="flex justify-end">
            <button type="button" onClick={() => removeRow(setRows, rows, index, { date: "", title: "", description: "" })} className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--muted)]">
              删除这一条
            </button>
          </div>
        </div>
      ))}
      <div>
        <button type="button" onClick={() => setRows([...rows, { date: "", title: "", description: "" }])} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--foreground)]">
          新增时间线
        </button>
      </div>
    </div>
  );
}

export function SourceEditor({ name, initialValue }: { name: string; initialValue: string }) {
  const initialRows = useMemo(() => parseSourceRows(initialValue), [initialValue]);
  const [rows, setRows] = useState<SourceRow[]>(initialRows.length ? initialRows : [{ title: "", url: "", type: "", publisher: "", date: "", note: "" }]);

  const encoded = rows
    .map((row) => [row.title, row.url, row.type, row.publisher, row.date, row.note].map((item) => item.trim()).join(" | "))
    .filter((line) => line.replace(/\|/g, "").trim())
    .join("\n");

  return (
    <div className="grid gap-3">
      <input type="hidden" name={name} value={encoded} readOnly />
      {rows.map((row, index) => (
        <div key={index} className="grid gap-3 rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <EditorField label="标题" value={row.title} onChange={(value) => updateRow(setRows, rows, index, { ...row, title: value })} placeholder="来源标题" />
            <EditorField label="URL" value={row.url} onChange={(value) => updateRow(setRows, rows, index, { ...row, url: value })} placeholder="https://..." />
            <EditorField label="类型" value={row.type} onChange={(value) => updateRow(setRows, rows, index, { ...row, type: value })} placeholder="官网 / 归档 / 媒体 / 社媒" />
            <EditorField label="发布方" value={row.publisher} onChange={(value) => updateRow(setRows, rows, index, { ...row, publisher: value })} placeholder="媒体名 / 公司名" />
            <EditorField label="日期" value={row.date} onChange={(value) => updateRow(setRows, rows, index, { ...row, date: value })} placeholder="2024-05 或 2024-05-01" />
          </div>
          <EditorArea label="备注" value={row.note} onChange={(value) => updateRow(setRows, rows, index, { ...row, note: value })} placeholder="这条来源为什么重要。" rows={3} />
          <div className="flex justify-end">
            <button type="button" onClick={() => removeRow(setRows, rows, index, { title: "", url: "", type: "", publisher: "", date: "", note: "" })} className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--muted)]">
              删除这一条
            </button>
          </div>
        </div>
      ))}
      <div>
        <button type="button" onClick={() => setRows([...rows, { title: "", url: "", type: "", publisher: "", date: "", note: "" }])} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--foreground)]">
          新增来源
        </button>
      </div>
    </div>
  );
}

function EditorField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-[var(--foreground)]">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-[var(--foreground)] outline-none" />
    </label>
  );
}

function EditorArea({ label, value, onChange, placeholder, rows }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; rows: number }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-[var(--foreground)]">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={rows} className="rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-[var(--foreground)] outline-none" />
    </label>
  );
}

function updateRow<T>(setRows: (rows: T[]) => void, rows: T[], index: number, next: T) {
  const cloned = [...rows];
  cloned[index] = next;
  setRows(cloned);
}

function removeRow<T>(setRows: (rows: T[]) => void, rows: T[], index: number, emptyRow: T) {
  const next = rows.filter((_, currentIndex) => currentIndex !== index);
  setRows(next.length ? next : [emptyRow]);
}

function parseTimelineRows(value: string): TimelineRow[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [date = "", title = "", ...rest] = line.split("|").map((item) => item.trim());
      return { date, title, description: rest.join(" | ") };
    });
}

function parseSourceRows(value: string): SourceRow[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title = "", url = "", type = "", publisher = "", date = "", ...rest] = line.split("|").map((item) => item.trim());
      return { title, url, type, publisher, date, note: rest.join(" | ") };
    });
}
