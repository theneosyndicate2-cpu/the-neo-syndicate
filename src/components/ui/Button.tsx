import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg" | "sm";

const base =
  "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden font-mono font-medium uppercase tracking-[0.16em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "chamfer bg-gradient-to-b from-gold-light via-gold to-gold-deep text-ink hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 drop-shadow-[0_10px_30px_rgba(212,175,95,0.35)]",
  secondary:
    "chamfer bg-cyan/[0.06] text-cyan-light shadow-[inset_0_0_0_1px_rgba(56,225,255,0.35)] backdrop-blur hover:bg-cyan/[0.12] hover:text-white hover:shadow-[inset_0_0_0_1px_rgba(56,225,255,0.8),0_0_30px_-6px_rgba(56,225,255,0.6)]",
  ghost: "text-mist hover:text-cyan-light",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.625rem]",
  md: "h-11 px-6 text-[0.6875rem]",
  lg: "h-13 px-8 text-[0.71875rem] sm:h-14 sm:px-9",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: boolean;
  children: ReactNode;
  className?: string;
}

function Inner({ children, icon, variant }: { children: ReactNode; icon?: boolean; variant: Variant }) {
  return (
    <>
      {variant !== "ghost" && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent to-transparent transition-transform duration-1000 group-hover:translate-x-full",
            variant === "primary" ? "via-white/45" : "via-cyan/25",
          )}
        />
      )}
      <span className="relative">{children}</span>
      {icon && (
        <ArrowUpRight
          aria-hidden
          className="relative size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.75}
        />
      )}
    </>
  );
}

type LinkButtonProps = CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">;

export function ButtonLink({ variant = "primary", size = "md", icon, className, children, ...props }: LinkButtonProps) {
  const external = typeof props.href === "string" && /^https?:\/\//.test(props.href);
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      <Inner icon={icon} variant={variant}>
        {children}
      </Inner>
    </Link>
  );
}

type ButtonProps = CommonProps & Omit<ComponentProps<"button">, "className" | "children">;

export function Button({ variant = "primary", size = "md", icon, className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <Inner icon={icon} variant={variant}>
        {children}
      </Inner>
    </button>
  );
}
