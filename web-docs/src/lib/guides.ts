export type Section = {
  id: string;
  title: string;
  paragraphs?: string[];
  steps?: { title: string; body: string }[];
  note?: { title: string; body: string };
  prompt?: string;
  checks?: string[];
  faqs?: { question: string; answer: string }[];
};

export type Guide = {
  slug: string;
  title: string;
  shortTitle: string;
  /** Who acts in this step: the user on the computer, or the user asking Claude. */
  actor: "Bạn làm trên máy" | "Bạn yêu cầu Claude";
  description: string;
  sections: Section[];
};

export const cycle: Guide[] = [
  {
    slug: "tai-workflow", title: "Tải workflow", shortTitle: "Tải workflow", actor: "Bạn làm trên máy",
    description: "Tải ZIP từ GitHub và giải nén. Mỗi doanh nghiệp dùng một bản riêng.",
    sections: [{ id: "download", title: "Code → Download ZIP" }]
  },
  {
    slug: "dat-tai-lieu", title: "Đặt tài liệu vào inputs", shortTitle: "Đặt tài liệu vào inputs", actor: "Bạn làm trên máy",
    description: "Claude đọc tài liệu doanh nghiệp từ hai thư mục này.",
    sections: [
      { id: "where", title: "Thư mục", steps: [
        { title: "inputs/01_company_info", body: "Hồ sơ công ty, hồ sơ năng lực, dự án, case study." },
        { title: "inputs/02_marketing_materials", body: "Brochure, mô tả sản phẩm/dịch vụ, bảng giá." }
      ], paragraphs: ["Ưu tiên PDF, Word, Excel có chữ. Ảnh scan có thể không đọc được."] }
    ]
  },
  {
    slug: "mo-claude-code", title: "Mở workflow bằng Claude Code", shortTitle: "Mở bằng Claude Code", actor: "Bạn làm trên máy",
    description: "Claude Desktop → tab Code → Choose… → Open folder… → chọn thư mục workflow, quyền Manual. Cần gói Pro, Max, Team hoặc Enterprise.",
    sections: [
      { id: "overview", title: "Vị trí các nút" },
      { id: "folder", title: "Chọn thư mục workflow" },
      { id: "permissions", title: "Chọn quyền: Manual", steps: [
        { title: "Auto", body: "Claude tự quyết định việc nào cần hỏi. Không nên dùng khi mới bắt đầu." },
        { title: "Manual (nên chọn)", body: "Luôn hỏi bạn trước khi sửa tệp hoặc chạy lệnh." },
        { title: "Accept edits", body: "Tự sửa tệp không hỏi; chạy lệnh vẫn hỏi." },
        { title: "Plan", body: "Chỉ lập kế hoạch, chưa làm gì. Dùng khi muốn xem trước Claude định làm gì." },
        { title: "Bypass permissions (không dùng)", body: "Claude được sửa hoặc xóa tệp mà không hỏi." }
      ] },
      { id: "done", title: "Đã mở đúng", paragraphs: ["Thanh dưới ô nhập hiện This computer, tên thư mục workflow và Manual, như ảnh ở đầu bước."] }
    ]
  },
  {
    slug: "doc-tai-lieu", title: "Claude đọc tài liệu", shortTitle: "Claude đọc tài liệu", actor: "Bạn yêu cầu Claude",
    description: "Claude tóm tắt doanh nghiệp từ inputs và hỏi phần còn thiếu. Bạn xác nhận và chọn sản phẩm ưu tiên.",
    sections: [
      { id: "send", title: "Câu lệnh", prompt: "Đọc CLAUDE.md và tài liệu trong inputs. Báo tệp nào không đọc được, tóm tắt doanh nghiệp và hỏi tôi phần còn thiếu." }
    ]
  },
  {
    slug: "kiem-tra-moi-truong", title: "Claude kiểm tra môi trường", shortTitle: "Claude kiểm tra môi trường", actor: "Bạn yêu cầu Claude",
    description: "Claude kiểm tra máy và cài phần còn thiếu, gồm trình duyệt CloakBrowser.",
    sections: [
      { id: "send", title: "Câu lệnh", prompt: "Kiểm tra môi trường cho workflow này, báo phần còn thiếu và cài CloakBrowser theo workflows/CLOAKBROWSER.md." }
    ]
  },
  {
    slug: "ket-noi-mcp", title: "Claude kết nối công cụ (MCP)", shortTitle: "Claude kết nối công cụ", actor: "Bạn yêu cầu Claude",
    description: "Kết nối CloakBrowser và TinaCRM qua .mcp.json trong thư mục workflow.",
    sections: [
      { id: "browser", title: "CloakBrowser", prompt: "Kết nối CloakBrowser qua .mcp.json và mở thử một trang web công khai." },
      { id: "apikey-open", title: "TinaCRM: tạo API key", paragraphs: ["Đăng nhập TinaCRM của doanh nghiệp → Settings → MCP & APIs → tab API → Create API key."] },
      { id: "apikey-form", title: "Điền thông tin khóa", paragraphs: ["Role quyết định Claude được làm gì trong CRM: chọn role đủ quyền với khách hàng, công ty và công việc. Nên đặt ngày hết hạn thay vì Never."] },
      { id: "apikey-copy", title: "Sao chép khóa", paragraphs: ["Khóa chỉ hiện một lần. Bấm Copy rồi gửi câu lệnh dưới đây. Không dán khóa vào khung chat."], prompt: "Kết nối TinaCRM qua MCP. Hỏi tôi địa chỉ TinaCRM, bật hộp thoại để tôi dán API key, sau đó đọc thử dữ liệu khách hàng, chưa ghi gì." },
      { id: "apikey-paste", title: "Dán khóa vào hộp thoại", paragraphs: ["Claude bật hộp thoại Kết nối TinaCRM: dán khóa vào ô, bấm Lưu. Không thấy hộp thoại thì tìm trên thanh Dock (Mac) hoặc thanh tác vụ (Windows)."] },
      { id: "mcp-check", title: "Kiểm tra kết nối", paragraphs: ["Claude ghi kết nối tinacrm vào .mcp.json rồi nhờ bạn mở phiên mới (+ New) và cho phép thư mục nếu được hỏi. Từ đây Claude đọc và lưu khách vào TinaCRM qua MCP này; API key chỉ là quyền truy cập."] },
    ]
  },
  {
    slug: "khach-phu-hop", title: "Xác định khách phù hợp", shortTitle: "Xác định khách phù hợp", actor: "Bạn yêu cầu Claude",
    description: "Mỗi nhóm khách hoặc sản phẩm là một chiến dịch riêng. Chốt ngành, quy mô, khu vực và người ra quyết định cho chiến dịch.",
    sections: [
      { id: "send", title: "Câu lệnh", prompt: "Tạo chiến dịch mới. Hỏi tôi tên chiến dịch, nhóm khách và sản phẩm, rồi đề xuất tiêu chí khách hàng phù hợp (ICP). Lưu sau khi tôi duyệt." },
      { id: "more", title: "Thêm chiến dịch", paragraphs: ["Làm lại bước 7–9 cho mỗi chiến dịch mới. Tài liệu doanh nghiệp, TinaCRM và hộp thư dùng chung."] }
    ]
  },
  {
    slug: "tim-khach", title: "Tìm khách và lưu vào TinaCRM", shortTitle: "Tìm khách & lưu CRM", actor: "Bạn yêu cầu Claude",
    description: "Bắt đầu bằng danh sách nhỏ. Nếu nguồn cần đăng nhập, bạn tự đăng nhập trong cửa sổ CloakBrowser.",
    sections: [
      { id: "source", title: "Chọn nguồn", paragraphs: ["Claude đề xuất 2–3 nguồn hợp với nhóm khách của chiến dịch (ví dụ Google Maps, danh bạ doanh nghiệp, LinkedIn) kèm lý do. Bạn chọn số."], prompt: "Đề xuất nguồn tìm khách phù hợp nhất cho chiến dịch này." },
      { id: "find", title: "Tìm danh sách", prompt: "Tìm 10 khách theo ICP của chiến dịch, kèm lý do phù hợp và nguồn." },
      { id: "save", title: "Lưu TinaCRM", prompt: "Kiểm tra trùng (cả với chiến dịch khác) và lưu danh sách đã duyệt vào TinaCRM. Báo số tạo mới, cập nhật, bỏ qua và lỗi." }
    ]
  },
  {
    slug: "email", title: "Email chăm sóc", shortTitle: "Email chăm sóc", actor: "Bạn yêu cầu Claude",
    description: "Kết nối hộp thư (cần quyền gửi và đọc), duyệt chuỗi email trước khi gửi thật.",
    sections: [
      { id: "mailbox", title: "Kết nối hộp thư", prompt: "Kết nối hộp thư để gửi email và đọc phản hồi của khách." },
      { id: "sequence", title: "Chuỗi email", prompt: "Đề xuất chuỗi email chăm sóc: số email, khoảng cách gửi và email mẫu. Chưa gửi thật khi tôi chưa duyệt." },
      { id: "replies", title: "Xử lý phản hồi" }
    ]
  },
  {
    slug: "hang-ngay", title: "Chạy hằng ngày", shortTitle: "Chạy hằng ngày", actor: "Bạn yêu cầu Claude",
    description: "Sau lần thiết lập đầu, mỗi ngày chỉ cần bước này.",
    sections: [
      { id: "routine", title: "Câu lệnh", prompt: "Tiếp tục chiến dịch <tên chiến dịch>: kiểm tra phản hồi mới, tìm khách theo mục tiêu ngày và gửi email đến hạn." },
      { id: "parallel", title: "Chạy song song", steps: [
        { title: "Mở phiên mới", body: "Bấm + New. Mỗi phiên làm một chiến dịch hoặc một doanh nghiệp." },
        { title: "Chọn thư mục", body: "Cùng doanh nghiệp: chọn cùng thư mục. Doanh nghiệp khác: chọn thư mục của doanh nghiệp đó." },
        { title: "Gửi câu lệnh", body: "Gửi câu lệnh trên với tên chiến dịch của phiên đó." },
        { title: "Chạy theo lịch", body: "Scheduled: mỗi chiến dịch một lịch, giờ cách nhau ít nhất 30 phút." }
      ], note: { title: "Lưu ý", body: "Không đăng nhập cùng một tài khoản mạng xã hội ở hai chiến dịch chạy cùng lúc. Mỗi phiên tốn lượt dùng Claude riêng." } },
      { id: "outputs", title: "Kết quả", paragraphs: ["Mỗi chiến dịch: campaigns/<tên chiến dịch>/outputs. Báo cáo tuần: outputs/04_weekly_reports."] }
    ]
  },
  {
    slug: "bao-cao", title: "Báo cáo tuần", shortTitle: "Báo cáo tuần", actor: "Bạn yêu cầu Claude",
    description: "Khách mới, email đã gửi, phản hồi và đề xuất điều chỉnh.",
    sections: [
      { id: "setup", title: "Câu lệnh", prompt: "Thiết lập báo cáo hằng tuần: hỏi tôi người nhận, ngày, giờ gửi và cho xem bản nháp." }
    ]
  }
];

export const help: Guide = {
  slug: "tro-giup", title: "Câu hỏi thường gặp", shortTitle: "Câu hỏi thường gặp", actor: "Bạn yêu cầu Claude",
  description: "Các vướng mắc hay gặp.",
  sections: [
    { id: "faq", title: "Câu hỏi", faqs: [
      { question: "Làm tiếp ở phiên sau?", answer: "Mở lại thư mục workflow trong Code và gửi “Tiếp tục chiến dịch <tên>” hoặc “Tiếp tục từ lần trước”." },
      { question: "Claude báo đã lưu nhưng TinaCRM không có?", answer: "Yêu cầu Claude kiểm tra lại bằng công cụ và báo ID bản ghi." },
      { question: "CloakBrowser không mở?", answer: "Làm lại bước 6." },
      { question: "Lịch chạy không hoạt động?", answer: "Lịch chỉ chạy khi máy bật và Claude Desktop đang mở." },
      { question: "Dùng cho doanh nghiệp khác?", answer: "Tải một bản workflow riêng và làm lại từ bước 1. Chạy song song: xem bước 10." },
      { question: "Khách xuất hiện ở hai chiến dịch?", answer: "Claude giữ khách ở chiến dịch đầu tiên và báo “đã thuộc chiến dịch X”." }
    ] },
    { id: "usage", title: "Xem mức sử dụng Claude", paragraphs: ["Bấm tên tài khoản ở góc dưới bên trái → Usage."] }
  ]
};

export const guides: Guide[] = [...cycle, help];
export const stepNumber = (slug: string) => cycle.findIndex((g) => g.slug === slug) + 1;
export const guideHref = (slug: string) => `/huong-dan/${slug}`;
