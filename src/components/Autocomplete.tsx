import React, { useState, useRef, useEffect } from 'react';

interface AutocompleteProps {
  suggestions: string[];
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ suggestions, value, placeholder, onChange, className }) => {
  const [open, setOpen] = useState(false);
  // Use an internal input value for smoother typing UX, but keep it synced
  // with the incoming `value` prop when that prop changes from outside.
  const [inputValue, setInputValue] = useState<string>(value || '');
  const [highlight, setHighlight] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Sync incoming value to internal state when it changes externally.
    if ((value || '') !== inputValue) {
      setInputValue(value || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlight(-1);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const filtered = suggestions
    .filter(s => s && s.toLowerCase().includes(inputValue.toLowerCase()))
    .slice(0, 50);

  const handleInput = (v: string) => {
    // Update internal value immediately for responsive typing
    setInputValue(v);
    // open suggestions as the user types
    setOpen(true);
    setHighlight(-1);
    // propagate intermediate changes to parent so filters stay in sync
    onChange(v);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === 'ArrowDown') setOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlight >= 0 && highlight < filtered.length) {
        const sel = filtered[highlight];
        setInputValue(sel);
        onChange(sel);
        setOpen(false);
        setHighlight(-1);
      } else {
        // User pressed Enter without selecting: treat current input as value
        onChange(inputValue);
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setHighlight(-1);
    }
  };

  const onSelect = (s: string) => {
    setInputValue(s);
    onChange(s);
    setOpen(false);
    setHighlight(-1);
  };

  return (
    <div ref={containerRef} className={`autocomplete ${className || ''}`}>
      <input
        className="filter-select autocomplete-input"
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => { setOpen(false); setHighlight(-1); }}
        onKeyDown={handleKeyDown}
        aria-autocomplete="list"
        aria-expanded={open}
      />

      {open && filtered.length > 0 && (
        <ul className="autocomplete-list" role="listbox">
          {filtered.map((s, i) => (
            <li
              key={s + i}
              className={`autocomplete-item ${i === highlight ? 'highlight' : ''}`}
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={(e) => { e.preventDefault(); onSelect(s); }}
              role="option"
              aria-selected={i === highlight}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
