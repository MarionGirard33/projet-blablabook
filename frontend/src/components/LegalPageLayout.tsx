import type { ReactNode } from "react";

type LegalPageLayoutProps = Readonly<{
  title: string;
  subtitle?: string;
  children: ReactNode;
}>;

export default function LegalPageLayout({
  title,
  subtitle,
  children,
}: LegalPageLayoutProps) {
  return (
    <section className="mx-auto w-full max-w-4xl rounded-2xl border border-bookbeige/60 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
      <div className="mb-5 border-b border-bookbeige/60 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 max-w-3xl text-sm leading-5 text-gray-600 sm:text-base sm:leading-6">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="space-y-5 text-gray-700">{children}</div>
    </section>
  );
}
