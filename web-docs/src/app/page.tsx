import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { guideHref } from "@/lib/guides";

export default function Home() {
  return <div className="simple-home">
    <h1>Hướng dẫn sử dụng workflow</h1>
    <p className="home-intro">Tìm và chăm sóc khách hàng bằng Claude Code trên máy bạn. Hãy chọn việc bạn muốn làm.</p>
    <section className="start-choice">
      <h2>Tôi mới bắt đầu</h2>
      <p>Đi theo 3 bước dưới đây. Bạn không cần biết lập trình.</p>
      <ol className="start-steps">
        {[{ slug: "tai-workflow", title: "Tải workflow về máy", body: "Tải và giải nén bộ thư mục có sẵn." }, { slug: "tep-thu-muc", title: "Đặt tài liệu công ty đúng chỗ", body: "Sao chép tài liệu vào thư mục được hướng dẫn." }, { slug: "claude-desktop", title: "Mở workflow trong Claude Code", body: "Chọn Code → Local → thư mục workflow." }].map((item, index) => <li key={item.slug}><Link href={guideHref(item.slug)}><span className="start-step-number">{index + 1}</span><div><h3>{item.title}</h3><p>{item.body}</p></div><ArrowRightIcon /></Link></li>)}
      </ol>
      <Link className="button button-primary" href={guideHref("tai-workflow")}>Bắt đầu bước 1 <ArrowRightIcon /></Link>
    </section>
    <section className="continue-choice"><h2>Tôi đã thiết lập xong</h2><p>Mở lại chiến dịch và kiểm tra những việc cần làm hôm nay.</p><Link className="button button-soft" href={guideHref("hang-ngay")}>Xem công việc hằng ngày <ArrowRightIcon /></Link></section>
    <p className="home-help">Đang bị vướng? <Link href={guideHref("tro-giup")}>Xem cách xử lý</Link></p>
  </div>;
}
