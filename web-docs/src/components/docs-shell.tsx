"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, ReaderIcon as BookOpenIcon, CheckIcon, Cross1Icon, MagnifyingGlassIcon, HamburgerMenuIcon, SunIcon, MoonIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { guides, groups, guideHref } from "@/lib/guides";

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase();

export function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    try { const mode = localStorage.getItem("guide-theme"); const enabled = mode ? mode === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; setDark(enabled); document.documentElement.dataset.theme = enabled ? "dark" : "light"; } catch {}
    const update = () => { try { const data = JSON.parse(localStorage.getItem("guide-completed") || "[]"); if (Array.isArray(data)) setCompleted(data.filter((item) => typeof item === "string")); } catch {} };
    update(); window.addEventListener("guide-progress", update); return () => window.removeEventListener("guide-progress", update);
  }, []);
  useEffect(() => { if (search) { dialog.current?.showModal(); input.current?.focus(); } else dialog.current?.close(); }, [search]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearch((value) => !value); } };
    window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler);
  }, []);
  const results = guides.filter((guide) => normalize([guide.title, guide.description, ...guide.sections.map((s) => `${s.title} ${s.paragraphs?.join(" ") || ""} ${s.faqs?.map((f) => `${f.question} ${f.answer}`).join(" ") || ""}`)].join(" ")).includes(normalize(query)));
  const toggleTheme = () => { const enabled = !dark; setDark(enabled); document.documentElement.dataset.theme = enabled ? "dark" : "light"; try { localStorage.setItem("guide-theme", enabled ? "dark" : "light"); } catch {} };
  return <>
    <a className="skip-link" href="#noi-dung">Đến nội dung</a>
    <header className="topbar">
      <Link href="/" className="brand"><span className="brand-symbol"><BookOpenIcon /></span><span>workflow<span className="brand-divider">/</span><span className="brand-light">sổ tay</span></span></Link>
      <div className="header-actions"><button className="search-trigger" onClick={() => setSearch(true)}><MagnifyingGlassIcon /><span>Tìm hướng dẫn…</span><kbd>⌘ K</kbd></button><button className="icon-button" aria-label={dark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"} onClick={toggleTheme}>{dark ? <SunIcon /> : <MoonIcon />}</button><button className="icon-button mobile-toggle" aria-label="Mở hoặc đóng mục lục" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <Cross1Icon /> : <HamburgerMenuIcon />}</button></div>
    </header>
    <div className="workspace">
      <aside className={`sidebar ${menu ? "is-open" : ""}`} aria-label="Điều hướng tài liệu">
        <Link className={`overview-link ${pathname === "/" ? "active" : ""}`} href="/" onClick={() => setMenu(false)}><BookOpenIcon /> Tổng quan sổ tay</Link>
        {groups.map((group) => <div className="nav-group" key={group}><p className="nav-label">{group}</p><nav aria-label={group}>{guides.filter((g) => g.group === group).map((guide) => <Link onClick={() => setMenu(false)} href={guideHref(guide.slug)} key={guide.slug} className={`nav-link ${pathname === guideHref(guide.slug) ? "active" : ""}`}><span>{guide.shortTitle}</span>{completed.includes(guide.slug) && <CheckIcon aria-label="Đã đọc" />}</Link>)}</nav></div>)}
        <div className="sidebar-help"><span className="helper-mark">?</span><strong>Chưa biết bắt đầu từ đâu?</strong><p>Đọc bài đầu tiên. Chúng tôi sẽ dẫn bạn từng bước.</p><Link href={guideHref("bat-dau")} onClick={() => setMenu(false)}>Bắt đầu ở đây <ArrowRightIcon /></Link></div>
        <a className="claude-link" href="https://claude.ai/download" target="_blank" rel="noreferrer">Tải Claude Desktop <ExternalLinkIcon /></a>
      </aside>
      <main id="noi-dung" className="main-content" tabIndex={-1}>{children}<footer className="footer"><span>Sổ tay Workflow · Dành cho mọi doanh nghiệp</span><span>Học từng bước. Làm từng việc.</span></footer></main>
    </div>
    <dialog ref={dialog} className="search-dialog" onCancel={() => setSearch(false)} onClick={(event) => { if (event.target === dialog.current) setSearch(false); }}>
      <div className="search-dialog-header"><MagnifyingGlassIcon /><label className="sr-only" htmlFor="guide-search">Tìm hướng dẫn</label><input ref={input} id="guide-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Bạn muốn tìm hiểu điều gì?" /><button className="icon-button" aria-label="Đóng tìm kiếm" onClick={() => setSearch(false)}><Cross1Icon /></button></div>
      <div className="search-results"><p className="nav-label">{query ? `${results.length} hướng dẫn phù hợp` : "Các hướng dẫn"}</p>{results.map((guide) => <Link key={guide.slug} href={guideHref(guide.slug)} onClick={() => { setSearch(false); setQuery(""); }}><div><strong>{guide.shortTitle}</strong><p>{guide.description}</p></div><ArrowRightIcon /></Link>)}{results.length === 0 && <div className="search-empty"><strong>Chưa tìm thấy hướng dẫn</strong><p>Thử từ ngắn hơn, như “email”, “đăng nhập” hoặc “khách”.</p><Link href={guideHref("tro-giup")} onClick={() => setSearch(false)}>Xem phần trợ giúp</Link></div>}</div>
    </dialog>
  </>;
}
