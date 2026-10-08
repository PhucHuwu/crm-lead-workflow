"use client";

import { useRef, useState } from "react";
import { Cross1Icon, ZoomInIcon } from "@radix-ui/react-icons";
import type { Visual } from "@/lib/visuals";

export function GuideVisual({ visual }: { visual: Visual }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [failed, setFailed] = useState(false);
  const image = <div className="visual-image"><img src={visual.src} alt={visual.alt} loading="lazy" onError={() => setFailed(true)} />{visual.markers?.map((marker) => <span className="visual-marker" style={{ left: `${marker.x}%`, top: `${marker.y}%` }} key={marker.label} aria-hidden="true">{marker.label}</span>)}</div>;
  return <figure className="guide-visual"><div className="visual-top"><span>{visual.kind}</span><button onClick={() => dialog.current?.showModal()} disabled={failed}><ZoomInIcon /> Phóng to hình</button></div>{failed ? <p className="visual-error">Chưa tải được hình. Bạn có thể đọc hướng dẫn và thử tải lại trang.</p> : <button className="visual-open" onClick={() => dialog.current?.showModal()} aria-label={`Phóng to: ${visual.alt}`}>{image}</button>}<figcaption>{visual.caption}{visual.source && <a href={visual.source} target="_blank" rel="noreferrer">Xem nguồn hình</a>}</figcaption><dialog ref={dialog} className="visual-dialog" onClick={(event) => { if (event.target === dialog.current) dialog.current?.close(); }}><div className="visual-dialog-bar"><strong>{visual.kind}</strong><button className="icon-button" aria-label="Đóng hình phóng to" onClick={() => dialog.current?.close()}><Cross1Icon /></button></div>{image}<p>{visual.caption}</p></dialog></figure>;
}
