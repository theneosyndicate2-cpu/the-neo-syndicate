"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps } from "react";
import { Input } from "@/components/forms/Field";
import { cn } from "@/lib/utils";
import { PASSWORD_MIN } from "@/lib/validation";

type Props = Omit<ComponentProps<typeof Input>, "type"> & { showStrength?: boolean };

/** Password field with show/hide toggle and an optional strength meter. */
export function PasswordInput({ showStrength, className, value, ...props }: Props) {
  const [visible, setVisible] = useState(false);
  const v = typeof value === "string" ? value : "";
  const score =
    (v.length >= PASSWORD_MIN ? 1 : 0) +
    (v.length >= 14 ? 1 : 0) +
    (/[a-z]/.test(v) && /[A-Z]/.test(v) ? 1 : 0) +
    (/\d/.test(v) ? 1 : 0) +
    (/[^a-zA-Z0-9]/.test(v) ? 1 : 0);
  const level = !v ? 0 : score <= 2 ? 1 : score <= 3 ? 2 : 3;

  return (
    <div>
      <div className="relative">
        <Input {...props} value={value} type={visible ? "text" : "password"} className={cn("pr-12", className)} />
        <button
          type="button"
          onClick={() => setVisible((s) => !s)}
          className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-md text-muted transition-colors hover:text-cyan-light"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {showStrength && (
        <div className="mt-2 flex items-center gap-3" aria-hidden={!v}>
          <div className="flex flex-1 gap-1">
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-300",
                  level >= n ? (level === 1 ? "bg-down" : level === 2 ? "bg-gold" : "bg-up") : "bg-steel",
                )}
              />
            ))}
          </div>
          <span className="w-14 text-right font-mono text-[0.625rem] tracking-[0.12em] text-muted uppercase">
            {["", "Weak", "Fair", "Strong"][level]}
          </span>
        </div>
      )}
    </div>
  );
}
