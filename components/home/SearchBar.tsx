'use client';

import { useState, useRef, useEffect } from 'react';
import { searchStocks, koreanStocks } from '@/lib/data/stocks';

const popularKeywords = ['삼성전자', 'SK하이닉스', '에코프로', 'NAVER'];

interface Props {
  onSelect?: (code: string, name: string) => void;
  selectedName?: string;
}

export default function SearchBar({ onSelect, selectedName }: Props) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedName) setQuery(selectedName);
  }, [selectedName]);

  const filtered = query.trim() ? searchStocks(query, 8) : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (code: string, name: string) => {
    setQuery(name);
    setShowDropdown(false);
    setHighlightIndex(-1);
    if (onSelect) {
      onSelect(code, name);
    } else {
      window.location.href = `/${code}`;
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    if (/^\d{6}$/.test(trimmed)) { handleSelect(trimmed, trimmed); return; }
    if (filtered.length > 0) { handleSelect(filtered[0].code, filtered[0].name); return; }
    if (!onSelect) window.location.href = `/search?q=${encodeURIComponent(trimmed)}`;
  };

  const handleKeyDown = (e: any) => {
    if (!showDropdown || filtered.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIndex(p => Math.min(p + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIndex(p => Math.max(p - 1, 0)); }
    else if (e.key === 'Enter' && highlightIndex >= 0) { e.preventDefault(); handleSelect(filtered[highlightIndex].code, filtered[highlightIndex].name); }
    else if (e.key === 'Escape') setShowDropdown(false);
  };

  return (
    <div className="mb-3.5" ref={containerRef}>
      <div className="relative">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 h-14 bg-white rounded-2xl px-4 border-[1.5px] border-emerald-700/15 focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/15 transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
              <path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="#047857" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); setHighlightIndex(-1); }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              placeholder="종목명 또는 종목코드 검색"
              className="flex-1 min-w-0 text-[15px] text-text-primary bg-transparent outline-none placeholder:text-text-muted"
              autoComplete="off"
            />
            <button type="submit" className="text-xs px-3.5 py-2 bg-emerald-700 text-white rounded-lg font-semibold flex-shrink-0 hover:bg-emerald-800 transition-colors">
              확인하기
            </button>
          </div>
        </form>

        {showDropdown && filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-emerald-700/10 shadow-lg z-50 overflow-hidden max-h-[400px] overflow-y-auto">
            {filtered.map((stock, idx) => (
              <button
                key={stock.code}
                type="button"
                onClick={() => handleSelect(stock.code, stock.name)}
                onMouseEnter={() => setHighlightIndex(idx)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                  highlightIndex === idx ? 'bg-emerald-50' : 'hover:bg-gray-50'
                } ${idx !== filtered.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                    <path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="#9CA3AF" strokeWidth="2"/>
                  </svg>
                  <span className="text-sm font-semibold text-text-primary truncate">{stock.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold flex-shrink-0 ${
                    stock.market === 'KOSPI' ? 'bg-emerald-700 text-white' : 'bg-amber-500 text-white'
                  }`}>{stock.market}</span>
                </div>
                <span className="text-xs text-text-muted font-mono flex-shrink-0">{stock.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {!showDropdown && (
        <div className="flex gap-1.5 flex-wrap mt-3 px-1">
          <span className="text-xs text-text-muted self-center">인기:</span>
          {popularKeywords.map((kw) => {
            const stock = koreanStocks.find(s => s.name === kw);
            if (!stock) return null;
            return (
              <button
                key={kw}
                type="button"
                onClick={() => handleSelect(stock.code, stock.name)}
                className="text-xs px-3 py-1.5 bg-white text-emerald-700 border border-emerald-700/20 rounded-full font-medium hover:bg-emerald-50 transition-colors"
              >
                {kw}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
