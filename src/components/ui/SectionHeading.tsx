import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}

export function SectionHeading({ eyebrow, title, description, align = "left", className, as = "h2" }: SectionHeadingProps) {
  const Heading = as;
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <div className={cn("mb-5 flex items-center gap-3", align === "center" && "justify-center")}>
          <p className="eyebrow">{eyebrow}</p>
          <span aria-hidden className="h-px w-12 bg-gradient-to-r from-cyan/60 to-transparent" />
        </div>
      )}
      <Heading className="font-display text-3xl leading-[1.05] font-light tracking-[-0.03em] text-bone sm:text-4xl lg:text-[3.25rem]">
        {title}
      </Heading>
      {description && <p className="mt-5 text-base leading-relaxed text-mist sm:text-lg">{description}</p>}
    </Reveal>
  );
}
