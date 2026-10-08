import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeftIcon, ArrowRightIcon, InfoCircledIcon, ClockIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { guides, guideHref } from "@/lib/guides";
import { Checklist, CopyPrompt, MarkRead } from "@/components/guide-actions";
import { GuideVisual } from "@/components/guide-visual";
import { visuals } from "@/lib/visuals";

export function generateStaticParams() { return guides.map((g) => ({ slug: g.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const guide = guides.find((g) => g.slug === slug); return { title: guide?.title, description: guide?.description }; }

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = guides.findIndex((g) => g.slug === slug);
  if (index === -1) notFound();
  const guide = guides[index];
  return <div className="article-layout"><article className="article">
    <div className="breadcrumb"><Link href="/">Sổ tay</Link><span>/</span>{guide.group}</div>
    <header className="article-header"><div className="reading-time"><ClockIcon /> Khoảng {guide.minutes} phút đọc</div><h1>{guide.title}</h1><p>{guide.description}</p></header>
    {guide.slug === "tai-workflow" && <p style={{ marginBottom: 28 }}><a className="button button-primary" href="https://github.com/PhucHuwu/crm-lead-workflow" target="_blank" rel="noreferrer">Mở trang tải workflow <ExternalLinkIcon /></a></p>}
    <div className="mobile-contents"><details><summary>Trong bài này</summary>{guide.sections.map((s) => <a href={`#${s.id}`} key={s.id}>{s.title}</a>)}</details></div>
    {guide.sections.map((section, i) => <section className="article-section" id={section.id} key={section.id}>
      <h2><span>{String(i + 1).padStart(2, "0")}</span>{section.title}</h2>
      {section.paragraphs?.map((p) => <p key={p}>{p}</p>)}
      {section.steps && <ol className="steps">{section.steps.map((step, n) => <li key={step.title}><span className="step-number">{n + 1}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol>}
      {(visuals[`${guide.slug}:${section.id}`] || []).map((visual) => <GuideVisual key={visual.src} visual={visual} />)}
      {section.checks && <Checklist items={section.checks} storageKey={`guide-checks:${guide.slug}:${section.id}`} />}
      {section.prompt && <CopyPrompt text={section.prompt} />}
      {section.note && <aside className="note"><InfoCircledIcon /><div><strong>{section.note.title}</strong><p>{section.note.body}</p></div></aside>}
      {section.faqs && <div className="faqs">{section.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>}
    </section>)}
    <MarkRead slug={guide.slug} />
    <nav className="article-pagination" aria-label="Bài trước và tiếp theo">{index > 0 ? <Link href={guideHref(guides[index - 1].slug)}><span><ArrowLeftIcon /> Bài trước</span><strong>{guides[index - 1].shortTitle}</strong></Link> : <Link href="/"><span><ArrowLeftIcon /> Quay lại</span><strong>Tổng quan sổ tay</strong></Link>}{index < guides.length - 1 && <Link className="next-page" href={guideHref(guides[index + 1].slug)}><span>Tiếp theo <ArrowRightIcon /></span><strong>{guides[index + 1].shortTitle}</strong></Link>}</nav>
  </article><aside className="table-of-contents"><p>Trong bài này</p><nav aria-label="Mục lục bài viết">{guide.sections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}</nav><div className="toc-tip"><strong>Cứ đi từng bước.</strong><p>Bạn có thể nói “Tôi chưa hiểu” bất cứ lúc nào khi trò chuyện với Claude.</p></div></aside></div>;
}
