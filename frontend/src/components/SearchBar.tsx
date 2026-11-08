"use client";

import { useState, type FormEvent } from "react";

interface SearchBarProps {
  busy: boolean;
  active: boolean;
  onSearch: (query: string) => void;
  onClear: () => void;
}

export default function SearchBar({ busy, active, onSearch, onClear }: SearchBarProps) {
  const [text, setText] = useState("");
  const query = text.trim();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the browser's full-page form submit
    if (query.length >= 2 && !busy) onSearch(query);
  }

  function handleClear() {
    setText("");
    onClear();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={200}
        placeholder='Try "Amazon invoices over $500" or "flagged invoices from last month"'
        className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <button
        type="submit"
        disabled={busy || query.length < 2}
        className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {busy ? "Searching…" : "Search"}
      </button>
      {active && (
        <button
          type="button"
          onClick={handleClear}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
        >
          Clear
        </button>
      )}
    </form>
  );
}