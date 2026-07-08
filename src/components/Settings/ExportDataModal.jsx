import { useState, useEffect } from 'react';
import { X, FileText, FileSpreadsheet, FileType, Check } from 'lucide-react';
import DatePicker from '../DatePicker';
import { getToday } from '../../lib/utils';
import { CATEGORIES } from '../../data/categories';

const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name || 'Other';

const FORMATS = [
  { id: 'csv', label: 'CSV', desc: 'Plain comma-separated file', icon: FileText },
  { id: 'excel', label: 'Excel', desc: 'Excel-friendly CSV (UTF-8)', icon: FileSpreadsheet },
  { id: 'pdf', label: 'PDF', desc: 'Print-ready document', icon: FileType },
];

const HEADERS = ['Date', 'Merchant', 'Category', 'Source', 'Amount'];

export default function ExportDataModal({ transactions = [], onClose }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState(getToday());
  const [format, setFormat] = useState('csv');
  const [error, setError] = useState('');

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const rows = transactions
    .filter((t) => (!from || t.date >= from) && (!to || t.date <= to))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const dataRows = rows.map((t) => [
    t.date,
    t.merchant,
    catName(t.category),
    t.source === 'bank' ? 'Bank' : 'Added by you',
    Math.round(t.amount),
  ]);

  const download = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const csvString = () =>
    [HEADERS, ...dataRows]
      .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

  const exportCSV = () => download(new Blob([csvString()], { type: 'text/csv' }), 'finapp-transactions.csv');

  // A real Excel-friendly file: UTF-8 BOM + CSV opens cleanly in Excel/Sheets with
  // ₹ and names intact — no "format doesn't match extension" warning the old .xls
  // HTML-table hack produced.
  const exportExcel = () =>
    download(new Blob(['﻿' + csvString()], { type: 'text/csv;charset=utf-8' }), 'finapp-transactions.csv');

  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const tableHTML = () =>
    `<table><thead><tr>${HEADERS.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>` +
    dataRows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('') +
    `</tbody></table>`;

  const exportPDF = () => {
    const win = window.open('', '_blank');
    if (!win) return false;
    const rangeLabel = `${from || 'beginning'} → ${to || 'today'}`;
    win.document.write(`<html><head><title>FinApp transactions</title><style>
      body{font-family:Inter,-apple-system,sans-serif;padding:28px;color:#111827}
      h1{font-size:18px;margin:0 0 4px}
      p{color:#6b7280;font-size:12px;margin:0 0 18px}
      table{width:100%;border-collapse:collapse;font-size:12px}
      th,td{text-align:left;padding:8px 10px;border-bottom:1px solid #eee}
      th{color:#9ca3af;text-transform:uppercase;font-size:10px;letter-spacing:.04em}
      td:last-child,th:last-child{text-align:right}
    </style></head><body>
      <h1>FinApp — Transactions</h1>
      <p>${esc(rangeLabel)} · ${rows.length} transaction${rows.length === 1 ? '' : 's'}</p>
      ${tableHTML()}
    </body></html>`);
    win.document.close();
    win.focus();
    win.print();
    return true;
  };

  const handleExport = () => {
    if (rows.length === 0) return;
    if (format === 'pdf') {
      if (!exportPDF()) {
        setError('Couldn’t open the print window — allow pop-ups for this site, or export as CSV/Excel.');
        return;
      }
    } else if (format === 'excel') {
      exportExcel();
    } else {
      exportCSV();
    }
    onClose();
  };

  const inputClass =
    'w-full px-4 py-3 border border-[#e5e7eb] rounded-lg text-sm text-[#111827] outline-none focus:border-[#0E3F2E]';

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl">
        <div className="flex justify-between items-start px-8 pt-7 pb-2">
          <h2 className="font-display text-2xl text-[#111827]">Export data</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#f3f4f6] rounded-lg transition-colors">
            <X size={20} className="text-[#6b7280]" />
          </button>
        </div>

        <div className="px-8 py-5 space-y-5">
          {/* Date range */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">From</label>
              <DatePicker value={from} onChange={setFrom} max={to || getToday()} placeholder="Beginning" className={`${inputClass} text-left`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">To</label>
              <DatePicker value={to} onChange={setTo} max={getToday()} placeholder="Today" className={`${inputClass} text-left`} />
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">Format</label>
            <div className="grid grid-cols-3 gap-3">
              {FORMATS.map((f) => {
                const Icon = f.icon;
                const active = format === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFormat(f.id);
                      setError('');
                    }}
                    className={`relative flex flex-col items-start gap-2 p-3.5 rounded-xl border text-left transition-colors ${
                      active ? 'border-[#0E3F2E] bg-[#F0F7F3]' : 'border-[#e5e7eb] hover:bg-[#f9fafb]'
                    }`}
                  >
                    {active && (
                      <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#0E3F2E] flex items-center justify-center">
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </span>
                    )}
                    <Icon size={20} className={active ? 'text-[#0E3F2E]' : 'text-[#6b7280]'} />
                    <span className="text-sm font-semibold text-[#111827]">{f.label}</span>
                    <span className="text-[11px] text-[#9ca3af] leading-tight">{f.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-[#9ca3af]">
            {rows.length} transaction{rows.length === 1 ? '' : 's'} in this range.
          </p>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="px-8 py-5 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-[#e5e7eb] text-[#374151] text-sm font-medium rounded-lg hover:bg-[#f9fafb] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={rows.length === 0}
            className="px-6 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
