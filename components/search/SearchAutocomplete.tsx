'use client';

import { useState, useEffect, useRef } from 'react';
import { searchStocks, StockInfo } from '@/lib/data/stocks';

interface SearchAutocompleteProps {
  variant?: 'header' | 'main';
  initialQuery?: string;
  placeholder?: string;
}

export default function SearchAutocomplete({ 
  variant = 'header',
  initialQuery = '',
  placeholder = '종목 검색'
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<StockInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (query.trim().length > 0) {
      const results = searchStocks(query, 8);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const navigateToStock = (code: string) => {
    window.location.href = `/${code}`;
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter' && query.trim()) {
        e.preventDefault();
        const trimmed = query.trim();
        if (/^\d{6}$/.test(trimmed)) {
          navigateToStock(trimmed);
        } else {
          window.location.href = `/search?q=${encodeURIComponent(trimmed)}`;
        }
      }
      return;
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        navigateToStock(suggestions[selectedIndex].code);
      } else if (suggestions.length > 0) {
        navigateToStock(suggestions[0].code);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };
  
  if (variant === 'main') {
    return (
      <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
        <div className="flex items-center gap-2 h-14 bg-white rounded-2xl px-5 border-2 border-emerald-700 focus-within:ring-4 focus-within:ring-emerald-700/15 transition shadow-sm">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="#047857" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query && setSuggestions(searchStocks(query, 8))}
            placeholder="종목명 또는 종목코드로 검색"
            className="flex-1 min-w-0 text-base text-text-primary bg-transparent outline-none placeholder:text-text-muted"
            autoComplete="off"
          />
        </div>
        
        {isOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-emerald-700/15 shadow-xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
            {suggestions.map((stock, index) => (
              <a
                key={stock.code}
                href={`/${stock.code}`}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full text-left px-5 py-3 transition-colors flex items-center justify-between gap-3 ${
                  index === selectedIndex ? 'bg-emerald-50' : 'hover:bg-emerald-50'
                } ${
                  index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold flex-shrink-0 ${
                    stock.market === 'KOSPI' 
                      ? 'bg-emerald-700 text-white' 
                      : 'bg-amber-500 text-white'
                  }`}>
                    {stock.market}
                  </span>
                  <span className="font-semibold text-gray-900 truncate">
                    {stock.name}
                  </span>
                </div>
                <span className="text-sm text-gray-500 font-mono flex-shrink-0">
                  {stock.code}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // 헤더용
  return (
    <div ref={containerRef} className="relative flex-1 min-w-0" style={{ maxWidth: '280px' }}>
      <div className="flex items-center gap-2 h-11 bg-bg-page rounded-xl px-3 border border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/20 transition">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="#047857" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setSuggestions(searchStocks(query, 8))}
          placeholder={placeholder}
          className="flex-1 min-w-0 text-sm text-text-primary bg-transparent outline-none placeholder:text-text-muted"
          autoComplete="off"
        />
      </div>
      
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-emerald-700/15 shadow-xl overflow-hidden z-50 max-h-[360px] overflow-y-auto">
          {suggestions.map((stock, index) => (
            <a
              key={stock.code}
              href={`/${stock.code}`}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full text-left px-3 py-2.5 transition-colors flex items-center justify-between gap-2 ${
                index === selectedIndex ? 'bg-emerald-50' : 'hover:bg-emerald-50'
              } ${
                index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold flex-shrink-0 ${
                  stock.market === 'KOSPI' 
                    ? 'bg-emerald-700 text-white' 
                    : 'bg-amber-500 text-white'
                }`}>
                  {stock.market}
                </span>
                <span className="text-sm font-semibold text-gray-900 truncate">
                  {stock.name}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-mono flex-shrink-0">
                {stock.code}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
