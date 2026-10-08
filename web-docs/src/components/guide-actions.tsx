"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon, CheckCircledIcon } from "@radix-ui/react-icons";

export function CopyPrompt({ text, command = false }: { text: string; command?: boolean }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const copy = async () => { try { await navigator.clipboard.writeText(text); setStatus("copied"); } catch { setStatus("error"); } };
  return <div className="prompt-box"><div className="prompt-heading"><span>{command ? "Lệnh bạn tự chạy trên máy" : "Câu mẫu để gửi Claude"}</span><button onClick={copy}>{status === "copied" ? <CheckIcon /> : <CopyIcon />}{status === "copied" ? "Đã sao chép" : "Sao chép"}</button></div>{command ? <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontSize: 12 }}>{text}</pre> : <p>{text}</p>}<small aria-live="polite">{status === "error" ? "Chưa sao chép được. Bạn có thể chọn nội dung bên trên và sao chép thủ công." : command ? "Thay đường dẫn ví dụ; chạy từng dòng trong Terminal/PowerShell, không dán vào chat Claude." : status === "copied" ? "Mở Claude, dán vào ô trò chuyện và gửi." : "Bạn có thể sửa câu này cho phù hợp với mình."}</small></div>;
}

export function Checklist({ items, storageKey }: { items: string[]; storageKey: string }) {
  const [checked, setChecked] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => { try { const data = JSON.parse(localStorage.getItem(storageKey) || "[]"); if (Array.isArray(data)) setChecked(data.filter((i) => typeof i === "number")); } catch {} }, [storageKey]);
  const toggle = (index: number) => { const next = checked.includes(index) ? checked.filter((i) => i !== index) : [...checked, index]; setChecked(next); try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { setMessage("Trình duyệt chưa lưu được tiến độ. Bạn vẫn có thể đánh dấu trong phiên này."); } };
  return <div className="checklist">{items.map((item, index) => <label key={item} className={checked.includes(index) ? "checked" : ""}><input type="checkbox" checked={checked.includes(index)} onChange={() => toggle(index)} /><span>{item}</span></label>)}<small aria-live="polite">{message || "Dấu tích chỉ giúp bạn theo dõi trên trình duyệt này, không kiểm tra kết nối thực tế."}</small></div>;
}

export function MarkRead({ slug }: { slug: string }) {
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => { try { const data = JSON.parse(localStorage.getItem("guide-completed") || "[]"); setDone(Array.isArray(data) && data.includes(slug)); } catch {} }, [slug]);
  const toggle = () => { try { const data = JSON.parse(localStorage.getItem("guide-completed") || "[]"); const all: string[] = Array.isArray(data) ? data.filter((v) => typeof v === "string") : []; localStorage.setItem("guide-completed", JSON.stringify(done ? all.filter((s) => s !== slug) : Array.from(new Set([...all, slug])))); setDone(!done); window.dispatchEvent(new Event("guide-progress")); } catch { setMessage("Chưa lưu được tiến độ trên trình duyệt này."); } };
  return <div className="mark-read"><button className={`button ${done ? "button-soft" : "button-primary"}`} onClick={toggle}><CheckCircledIcon />{done ? "Đã đọc bài này" : "Đánh dấu đã đọc"}</button><span aria-live="polite">{message || "Tiến độ đọc được lưu trên trình duyệt của bạn."}</span></div>;
}
