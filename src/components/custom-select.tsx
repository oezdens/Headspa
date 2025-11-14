import React, { useState, useRef, useEffect } from "react";

type Option = { value: string; label: string };

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder
}: {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!open) setHighlighted(-1);
  }, [open]);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  const toggle = () => setOpen((s) => !s);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      setOpen(true);
      setHighlighted(0);
      return;
    }

    if (open) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted((h) => Math.min(h + 1, options.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlighted >= 0) handleSelect(options[highlighted].value);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={onKeyDown}
        className="w-full text-left bg-black text-white border border-white/10 rounded-md py-4 px-4 pr-10 flex items-center justify-between focus:outline-none"
      >
        <span className="truncate">{selectedLabel ?? placeholder}</span>
        <svg className="w-5 h-5 text-white/70" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-2 w-full bg-black border border-white/10 rounded-md max-h-52 overflow-auto shadow-lg"
        >
          {options.map((opt, idx) => {
            const active = highlighted === idx;
            const selected = opt.value === value;
              return (
              <li
                key={opt.value}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setHighlighted(idx)}
                onMouseLeave={() => setHighlighted(-1)}
                onClick={() => handleSelect(opt.value)}
                className={`cursor-pointer px-4 py-4 mb-3 last:mb-0 ${
                  active || selected
                    ? "bg-[#FFD700] text-black"
                    : "text-white hover:bg-[#FFD700]/10 hover:text-black"
                }`}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
