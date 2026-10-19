import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cycle, guideHref } from "@/lib/guides";

export default function Home() {
  return <div className="simple-home">
    <h1>Chu trình sử dụng workflow</h1>
    <p className="home-intro">Bước 1–3 làm trên máy. Từ bước 4 gửi câu lệnh cho Claude trong tab Code.</p>
    <section className="start-choice">
      <ol className="start-steps">
        {cycle.map((item, index) => <li key={item.slug}><Link href={guideHref(item.slug)}><span className="start-step-number">{index + 1}</span><div><h3>{item.shortTitle}</h3><p><span className="actor-tag">{item.actor}</span> {item.description}</p></div><ArrowRightIcon /></Link></li>)}
      </ol>
      <Link className="button button-primary" href={guideHref(cycle[0].slug)}>Bắt đầu bước 1 <ArrowRightIcon /></Link>
    </section>
    <p className="home-help">Đã thiết lập xong: mỗi ngày dùng <Link href={guideHref("hang-ngay")}>bước {cycle.findIndex((g) => g.slug === "hang-ngay") + 1}</Link>. <Link href={guideHref("tro-giup")}>Câu hỏi thường gặp</Link></p>
  </div>;
}
