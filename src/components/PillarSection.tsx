"use client";

import { ScrollReveal } from "@/components/ScrollReveal";

const pillars = [
  {
    label: "01",
    title: "フレームデータ",
    body: "数値と余白だけで、技の輪郭をすばやく掴む。",
  },
  {
    label: "02",
    title: "キャラ攻略",
    body: "クラシックとモダン、二つの操作思想を並べて読む。",
  },
  {
    label: "03",
    title: "用語とメタ",
    body: "記事と表がつながる、日本語の対戦データベース。",
  },
];

export function PillarSection() {
  return (
    <section className="border-t border-border/80 bg-surface/70">
      <div className="mx-auto grid max-w-6xl gap-px bg-border/80 px-6 sm:grid-cols-3 sm:px-10">
        {pillars.map((item, index) => (
          <ScrollReveal key={item.label} delay={index * 120}>
            <article className="space-y-4 bg-surface px-0 py-12 sm:px-8 sm:py-14">
              <p className="font-display text-sm font-bold tracking-[0.2em] text-accent">
                {item.label}
              </p>
              <h2 className="text-xl font-semibold text-foreground">
                {item.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted">{item.body}</p>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
