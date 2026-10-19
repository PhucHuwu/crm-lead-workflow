import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cycle, guideHref } from "@/lib/guides";

export default function Home() {
  return <div className="simple-home">
    <h1>Chu trình sử dụng workflow</h1>
    <p className="home-intro">Một chu trình duy nhất, làm lần lượt từ bước 1. Ba bước đầu bạn làm trên máy; từ bước 4, bạn gửi câu mẫu để Claude làm.</p>
    <section className="start-choice">
      <ol className="start-steps">
        {cycle.map((item, index) => <li key={item.slug}><Link href={guideHref(item.slug)}><span className="start-step-number">{index + 1}</span><div><h3>{item.shortTitle}</h3><p><span className="actor-tag">{item.actor}</span> {item.description}</p></div><ArrowRightIcon /></Link></li>)}
      </ol>
      <Link className="button button-primary" href={guideHref(cycle[0].slug)}>Bắt đầu bước 1 <ArrowRightIcon /></Link>
    </section>
    <p className="home-help">Đã làm xong lần đầu? Mỗi ngày chỉ cần <Link href={guideHref("hang-ngay")}>bước {cycle.findIndex((g) => g.slug === "hang-ngay") + 1}</Link>. Bị vướng? <Link href={guideHref("tro-giup")}>Xem cách xử lý</Link></p>
  </div>;
}
