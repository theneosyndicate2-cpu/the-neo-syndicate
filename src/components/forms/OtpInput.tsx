"use client";

import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
  describedBy?: string;
}

/**
 * Segmented one-time-code input: auto-advance, backspace navigation, paste of
 * the whole code, and `autocomplete="one-time-code"` for iOS/Android autofill.
 */
export function OtpInput({ value, onChange, onComplete, length = 6, disabled, invalid, autoFocus, describedBy }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const commit = (next: string) => {
    const clean = next.replace(/\D/g, "").slice(0, length);
    onChange(clean);
    if (clean.length === length) onComplete?.(clean);
    return clean;
  };

  const setAt = (index: number, char: string) => {
    const arr = digits.slice();
    arr[index] = char;
    // Collapse gaps so the value stays contiguous.
    return commit(arr.join(""));
  };

  const handleInput = (index: number, raw: string) => {
    const chars = raw.replace(/\D/g, "");
    if (!chars) return;
    if (chars.length > 1) {
      // Autofill / fast typing delivered several digits at once.
      const next = commit((value.slice(0, index) + chars).slice(0, length));
      refs.current[Math.min(next.length, length - 1)]?.focus();
      return;
    }
    const next = setAt(index, chars);
    refs.current[Math.min(next.length, length - 1)]?.focus();
  };

  const handleKey = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[index]) {
        commit(value.slice(0, index) + value.slice(index + 1));
      } else if (index > 0) {
        commit(value.slice(0, index - 1) + value.slice(index));
        refs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    const next = commit(pasted);
    refs.current[Math.min(next.length, length - 1)]?.focus();
  };

  return (
    <div className="flex justify-between gap-2 sm:gap-3" role="group" aria-label="Verification code">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={d}
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          data-autofocus={autoFocus && i === 0 ? "" : undefined}
          pattern="[0-9]*"
          maxLength={length}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${length}`}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-14 w-full min-w-0 rounded-lg border bg-ink/60 text-center font-mono text-2xl text-bone caret-cyan transition-all duration-200 outline-none sm:h-16",
            "focus:border-cyan/70 focus:shadow-[0_0_0_1px_rgba(56,225,255,0.4),0_0_24px_-6px_rgba(56,225,255,0.7)]",
            invalid ? "border-down/60 text-down" : d ? "border-gold/50" : "border-line-strong",
            disabled && "opacity-50",
          )}
        />
      ))}
    </div>
  );
}
