import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg" | "sm";

const base =
  "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-medium uppercase tracking-[0.2em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-gold-light via-gold to-gold-deep text-ink shadow-[0_0_0_1px_rgba(232,213,163,0.35),0_10px_40px_-12px_rgba(201,169,97,0.55)] hover:shadow-[0_0_0_1px_rgba(232,213,163,0.6),0_16px_50px_-10px_rgba(201,169,97,0.7)] hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "border border-line-strong bg-white/[0.02] text-bone backdrop-blur hover:border-gold/60 hover:text-gold-light hover:bg-white/[0.04]",
  ghost: "text-mist hover:text-gold-light",
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
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
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
