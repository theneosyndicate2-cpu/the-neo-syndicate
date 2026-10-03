import type { ReactNode } from "react";
import { PageHero } from "./PageHero";

interface LegalPageProps {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}

export function LegalPage({ eyebrow, title, updated, children }: LegalPageProps) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={`Last updated ${updated}`} />
      <section className="pb-24 sm:pb-32">
        <div className="container-luxe">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-gold/25 bg-gold/[0.04] p-5 text-xs leading-relaxed text-mist">
              <span className="mr-2 text-[0.625rem] tracking-[0.22em] text-gold uppercase">Draft notice</span>
              This document is placeholder legal copy provided for structure only. It must be reviewed and finalised by
              a qualified legal professional, with regard to the laws and regulators of each jurisdiction in which The
              Neo Syndicate operates, before being relied upon.
            </div>
            <article className="legal mt-6">{children}</article>
          </div>
        </div>
      </section>
    </>
  );
}
