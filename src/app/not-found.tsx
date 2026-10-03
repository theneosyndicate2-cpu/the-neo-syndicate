import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative grid min-h-[80svh] place-items-center overflow-hidden pt-24">
      <div aria-hidden className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="container-luxe relative text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-6 font-display text-5xl font-light tracking-tight text-bone sm:text-7xl">
          Off the <span className="text-gold-gradient">chart.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-mist">The page you were looking for doesn’t exist or has moved.</p>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/" size="lg" icon>
            Return home
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
