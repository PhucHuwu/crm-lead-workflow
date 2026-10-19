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
    slug: "tai-workflow", title: "Tải workflow về máy", shortTitle: "Tải workflow về máy", actor: "Bạn làm trên máy",
    description: "Trên trang GitHub, bấm Code → Download ZIP rồi giải nén. Mỗi doanh nghiệp dùng một bản riêng, có thể đổi tên thư mục theo doanh nghiệp.",
    sections: [
      { id: "download", title: "Code → Download ZIP" },
      { id: "ready", title: "Xong khi", checks: ["Thư mục đã giải nén có inputs, outputs và CLAUDE.md."] }
    ]
  },
  {
    slug: "dat-tai-lieu", title: "Đặt tài liệu công ty vào thư mục inputs", shortTitle: "Đặt tài liệu vào inputs", actor: "Bạn làm trên máy",
    description: "Sao chép tài liệu doanh nghiệp vào hai thư mục dưới đây. Claude sẽ đọc ở bước 4.",
    sections: [
      { id: "where", title: "Tài liệu nào đặt ở đâu?", steps: [
        { title: "inputs/01_company_info — công ty là ai", body: "Hồ sơ công ty, hồ sơ năng lực, dự án và câu chuyện khách hàng thực tế." },
        { title: "inputs/02_marketing_materials — công ty bán gì", body: "Brochure, giới thiệu sản phẩm/dịch vụ, bảng giá." }
      ], note: { title: "Định dạng nên dùng", body: "PDF, Word, Excel có chữ chọn được. Ảnh scan có thể không đọc được; Claude sẽ báo ở bước 4." } }
    ]
  },
  {
    slug: "mo-claude-code", title: "Mở workflow bằng Claude Code", shortTitle: "Mở bằng Claude Code", actor: "Bạn làm trên máy",
    description: "Dùng tab Code trong Claude Desktop, chọn Local và thư mục workflow. Không dùng tab Chat.",
    sections: [
      { id: "code", title: "Chọn tab Code", paragraphs: ["Cần Claude Desktop (claude.ai/download) với gói Pro, Max, Team hoặc Enterprise. Bấm biểu tượng </> ở góc trên bên trái."] },
      { id: "folder", title: "Local → No folder → Open folder…", paragraphs: ["Chọn thư mục workflow ở bước 1. Khi xong, No folder đổi thành tên thư mục."] },
      { id: "open-folder", title: "Menu chọn thư mục" },
      { id: "permissions", title: "Chọn quyền Manual", paragraphs: ["Claude sẽ hỏi trước khi sửa tệp hoặc chạy lệnh. Không chọn Bypass permissions."] }
    ]
  },
  {
    slug: "doc-tai-lieu", title: "Yêu cầu Claude đọc tài liệu inputs", shortTitle: "Claude đọc tài liệu", actor: "Bạn yêu cầu Claude",
    description: "Claude đọc tài liệu bạn đã đặt, tóm tắt doanh nghiệp và hỏi phần còn thiếu.",
    sections: [
      { id: "send", title: "Gửi câu này cho Claude", prompt: "Hãy đọc CLAUDE.md và tài liệu trong inputs. Báo tệp nào đọc được, tệp nào không, rồi tóm tắt doanh nghiệp của tôi. Nếu thiếu thông tin, hỏi tôi từng câu. Tôi ít quen công nghệ, hãy hướng dẫn từng bước." },
      { id: "confirm", title: "Kiểm tra bản tóm tắt", paragraphs: ["Đọc tên doanh nghiệp, sản phẩm, điểm mạnh và số liệu. Sai chỗ nào, nói thẳng chỗ đó. Sau đó chọn sản phẩm muốn ưu tiên khi Claude hỏi."] },
      { id: "add-folder", title: "Tài liệu nằm ở thư mục khác?", paragraphs: ["Bấm nút thư mục có dấu cộng (Add another folder) phía trên ô nhập để thêm thư mục đó, rồi nói tên thư mục cho Claude."] },
      { id: "ready", title: "Xong khi", checks: ["Bản tóm tắt doanh nghiệp đã đúng.", "Tôi đã chọn sản phẩm/dịch vụ ưu tiên."] }
    ]
  },
  {
    slug: "kiem-tra-moi-truong", title: "Yêu cầu Claude kiểm tra môi trường", shortTitle: "Claude kiểm tra môi trường", actor: "Bạn yêu cầu Claude",
    description: "Claude kiểm tra máy đã có những gì và cài phần còn thiếu (như trình duyệt CloakBrowser) sau khi bạn cho phép.",
    sections: [
      { id: "send", title: "Gửi câu này cho Claude", prompt: "Hãy kiểm tra môi trường trên máy cho workflow này. Nói ngắn phần nào đã có, phần nào thiếu. Giải thích trước khi cài, rồi cài CloakBrowser theo workflows/CLOAKBROWSER.md khi tôi đồng ý." },
      { id: "approve", title: "Duyệt từng thao tác", paragraphs: ["Khi ứng dụng hỏi quyền, chỉ cho phép lệnh đúng việc Claude vừa giải thích. Nếu cần cài Python hoặc nhập mật khẩu máy, Claude sẽ nhờ bạn tự làm."] },
      { id: "ready", title: "Xong khi", checks: ["Claude báo môi trường đã đủ bằng kết quả kiểm tra thật."] }
    ]
  },
  {
    slug: "ket-noi-mcp", title: "Yêu cầu Claude kết nối công cụ (MCP)", shortTitle: "Claude kết nối công cụ", actor: "Bạn yêu cầu Claude",
    description: "Kết nối trình duyệt CloakBrowser và TinaCRM để Claude tìm khách và lưu vào CRM.",
    sections: [
      { id: "browser", title: "Kết nối trình duyệt CloakBrowser", paragraphs: ["Claude tự thêm cấu hình vào tệp .mcp.json trong thư mục workflow. Khi được nhắc, mở lại session để công cụ được nạp."], prompt: "Hãy kết nối CloakBrowser cho Claude Code qua tệp .mcp.json trong thư mục này, rồi mở thử một trang web công khai để kiểm tra." },
      { id: "tinacrm", title: "Kết nối TinaCRM", paragraphs: ["Bạn tự đăng nhập và cấp quyền trên màn hình TinaCRM. Nếu cần khóa API, quản trị viên tạo trong Settings → MCP & APIs; không dán khóa vào chat."], prompt: "Hãy kết nối TinaCRM với Claude Code. Hỏi tôi địa chỉ TinaCRM trước, hướng dẫn tôi đăng nhập từng bước, rồi đọc thử các ô thông tin khách hàng. Chưa tạo, sửa hay xóa dữ liệu. Không yêu cầu mật khẩu hoặc khóa trong chat." },
      { id: "ready", title: "Xong khi", checks: ["CloakBrowser mở được trang thử.", "Claude đọc được dữ liệu thử từ đúng TinaCRM của doanh nghiệp."] }
    ]
  },
  {
    slug: "khach-phu-hop", title: "Yêu cầu Claude xác định khách phù hợp", shortTitle: "Xác định khách phù hợp", actor: "Bạn yêu cầu Claude",
    description: "Thống nhất ngành, quy mô, khu vực và người ra quyết định trước khi tìm danh sách.",
    sections: [
      { id: "send", title: "Gửi câu này cho Claude", prompt: "Dựa trên tài liệu doanh nghiệp, hãy đề xuất nhóm khách phù hợp và thị trường nên ưu tiên. Giải thích ngắn rồi hỏi tôi chọn từng phần. Lưu tiêu chí đã chốt vào outputs." },
      { id: "ready", title: "Xong khi", checks: ["Tôi đã duyệt tiêu chí khách phù hợp.", "Tiêu chí được lưu trong outputs/01_icp_criteria."] }
    ]
  },
  {
    slug: "tim-khach", title: "Yêu cầu Claude tìm khách và lưu vào TinaCRM", shortTitle: "Tìm khách & lưu CRM", actor: "Bạn yêu cầu Claude",
    description: "Bắt đầu bằng danh sách nhỏ, kiểm tra kỹ rồi mới lưu vào TinaCRM.",
    sections: [
      { id: "find", title: "Tìm một danh sách nhỏ", paragraphs: ["Claude sẽ hỏi bạn có tài khoản nào (LinkedIn, Apollo…) và muốn bao nhiêu khách mỗi ngày. Nếu cần đăng nhập, Claude mở cửa sổ CloakBrowser; bạn tự đăng nhập rồi báo “Tôi đã đăng nhập”."], prompt: "Hãy tìm một danh sách nhỏ theo tiêu chí đã chốt. Với mỗi khách, cho tôi biết vì sao phù hợp và nguồn thông tin. Không tự tạo tên hoặc email." },
      { id: "save", title: "Lưu vào TinaCRM", prompt: "Hãy kiểm tra trùng với TinaCRM rồi lưu danh sách tôi đã duyệt. Báo số khách tạo mới, cập nhật, bỏ qua và lỗi." },
      { id: "ready", title: "Xong khi", checks: ["Tôi đã duyệt danh sách mẫu.", "Claude báo kết quả lưu TinaCRM bằng số liệu thật."] }
    ]
  },
  {
    slug: "email", title: "Yêu cầu Claude kết nối email và soạn chuỗi chăm sóc", shortTitle: "Email chăm sóc", actor: "Bạn yêu cầu Claude",
    description: "Kết nối hộp thư, duyệt kế hoạch gửi và email mẫu trước khi gửi thật.",
    sections: [
      { id: "mailbox", title: "Kết nối hộp thư", paragraphs: ["Đăng nhập và cấp quyền trên màn hình của Gmail/Outlook, không gửi mật khẩu trong chat. Cần quyền cả gửi và đọc thư để biết khách trả lời."], prompt: "Hãy giúp tôi kết nối hộp thư để gửi email và đọc phản hồi của khách. Hỏi tôi dùng loại hộp thư nào trước, rồi hướng dẫn từng bước." },
      { id: "sequence", title: "Duyệt chuỗi email", prompt: "Hãy đề xuất chuỗi email chăm sóc cho nhóm khách đã lưu: số email, khoảng cách gửi và một email mẫu. Chưa gửi thật đến khi tôi đồng ý." },
      { id: "replies", title: "Khi khách trả lời", paragraphs: ["Khách trả lời thật: dừng chuỗi và tạo việc cho người phụ trách trong TinaCRM. Khách yêu cầu ngừng: dừng hẳn. Thư tự động hoặc lỗi: xử lý riêng."] },
      { id: "ready", title: "Xong khi", checks: ["Hộp thư đã kết nối.", "Tôi đã duyệt kế hoạch và cho phép phạm vi gửi."] }
    ]
  },
  {
    slug: "hang-ngay", title: "Chạy công việc mỗi ngày", shortTitle: "Chạy mỗi ngày", actor: "Bạn yêu cầu Claude",
    description: "Từ đây chu trình lặp lại: mở thư mục, gửi một câu, xem kết quả.",
    sections: [
      { id: "routine", title: "Mỗi sáng gửi câu này", prompt: "Tiếp tục chiến dịch. Kiểm tra phản hồi mới, tìm khách theo mục tiêu đã chốt và gửi các email đến hạn trong phạm vi tôi đã cho phép. Báo rõ phần nào chưa chạy được." },
      { id: "outputs", title: "Kết quả lưu ở đâu?", paragraphs: ["Thư mục outputs: 01_icp_criteria (tiêu chí), 02_crawled_leads (danh sách khách), 03_email_cadence (kế hoạch email), 04_weekly_reports (báo cáo). Tiến trình lưu ở config/workflow_progress.md."] },
      { id: "end", title: "Trước khi tắt máy", prompt: "Tóm tắt việc đã làm, kết quả thật, việc đang chờ và bước tiếp theo. Lưu tiến trình vào config/workflow_progress.md." }
    ]
  },
  {
    slug: "bao-cao", title: "Xem báo cáo hằng tuần", shortTitle: "Báo cáo tuần", actor: "Bạn yêu cầu Claude",
    description: "Xem số khách mới, email đã gửi, phản hồi và một điều nên thay đổi cho tuần sau.",
    sections: [
      { id: "setup", title: "Thiết lập báo cáo", prompt: "Hãy thiết lập báo cáo hằng tuần. Hỏi tôi người nhận, ngày và giờ gửi, rồi cho tôi xem bản nháp trước." },
      { id: "improve", title: "Cải thiện tuần sau", prompt: "Dựa trên dữ liệu thật tuần này, đề xuất một thay đổi đáng làm nhất cho tuần sau và hỏi tôi có áp dụng không." }
    ]
  }
];

export const help: Guide = {
  slug: "tro-giup", title: "Khi bị vướng", shortTitle: "Khi bị vướng", actor: "Bạn yêu cầu Claude",
  description: "Gửi một câu để Claude hướng dẫn tiếp.",
  sections: [
    { id: "help", title: "Gửi câu này cho Claude", prompt: "Tôi đang bị vướng ở bước này. Hãy hỏi tôi đang thấy gì trên màn hình, mỗi lần một câu, và hướng dẫn từng thao tác." },
    { id: "faq", title: "Câu hỏi thường gặp", faqs: [
      { question: "Quay lại làm tiếp thế nào?", answer: "Mở tab Code, chọn Local và đúng thư mục workflow, gửi “Tiếp tục từ chỗ lần trước”. Claude đọc tiến trình đã lưu và đề nghị bước tiếp theo." },
      { question: "Claude nói đã lưu nhưng TinaCRM không có", answer: "Yêu cầu Claude kiểm tra lại bằng công cụ và báo số bản ghi thật. Viết trong chat không có nghĩa đã lưu." },
      { question: "Không thấy cửa sổ CloakBrowser", answer: "Quay lại bước 6 và nhờ Claude kiểm tra kết nối trình duyệt." },
      { question: "Đặt giờ rồi mà chưa tự chạy", answer: "Máy phải bật và Claude Desktop phải mở. Nhờ Claude kiểm tra lịch đã thật sự được tạo chưa." },
      { question: "Xem mức sử dụng Claude ở đâu?", answer: "Bấm tên tài khoản ở góc dưới bên trái Claude Desktop → Usage." },
      { question: "Doanh nghiệp khác dùng được không?", answer: "Được. Tải một bản workflow riêng cho mỗi doanh nghiệp và làm lại chu trình từ bước 1." }
    ] }
  ]
};

export const guides: Guide[] = [...cycle, help];
export const stepNumber = (slug: string) => cycle.findIndex((g) => g.slug === slug) + 1;
export const guideHref = (slug: string) => `/huong-dan/${slug}`;
