export type FaqItem = { q: string; a: string };

/** FAQ 렌더링 + FAQPage 구조화 데이터를 함께 내보낸다. */
export default function Faq({ items, heading = "Frequently asked questions" }: { items: FaqItem[]; heading?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-xl font-semibold tracking-tight">
        {heading}
      </h2>
      <dl className="mt-5 divide-y divide-border border-y border-border">
        {items.map((item) => (
          <div key={item.q} className="py-4">
            <dt className="font-medium">{item.q}</dt>
            <dd className="mt-1.5 text-[15px] leading-relaxed text-text-muted">{item.a}</dd>
          </div>
        ))}
      </dl>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
