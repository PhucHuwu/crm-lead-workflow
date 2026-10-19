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
    description: "Tải bộ thư mục có sẵn và giải nén. Mỗi doanh nghiệp dùng một bản riêng.",
    sections: [
      { id: "download", title: "Tải bản ZIP", steps: [
        { title: "Mở trang workflow", body: "Bấm nút “Mở trang tải workflow” ở trên, hoặc dùng đường dẫn người hỗ trợ gửi." },
        { title: "Chọn Code → Download ZIP", body: "Bấm nút Code màu xanh rồi chọn Download ZIP. Tệp được lưu trong Downloads (Tải xuống)." }
      ], note: { title: "Trang không mở được?", body: "Kho có thể cần quyền truy cập. Nhờ người hỗ trợ cấp quyền hoặc gửi trực tiếp tệp ZIP." } },
      { id: "unzip", title: "Giải nén và cất ở chỗ dễ tìm", steps: [
        { title: "Windows", body: "Chuột phải vào tệp ZIP → Extract All → chọn Documents → Extract." },
        { title: "Mac", body: "Bấm đúp tệp ZIP. Kéo thư mục vừa tạo vào Documents." },
        { title: "Đặt tên theo doanh nghiệp", body: "Ví dụ: Workflow - Công ty ABC. Giữ nguyên tên các thư mục bên trong." }
      ] },
      { id: "ready", title: "Xong khi", checks: ["Tôi đã mở thư mục đã giải nén, không phải tệp ZIP.", "Bên trong có inputs, outputs và CLAUDE.md."] }
    ]
  },
  {
    slug: "dat-tai-lieu", title: "Đặt tài liệu công ty vào thư mục inputs", shortTitle: "Đặt tài liệu vào inputs", actor: "Bạn làm trên máy",
    description: "Tự sao chép hồ sơ công ty và tài liệu sản phẩm vào đúng thư mục. Claude sẽ đọc ở bước 4.",
    sections: [
      { id: "where", title: "Tài liệu nào đặt ở đâu?", steps: [
        { title: "Công ty là ai → inputs/01_company_info", body: "Hồ sơ công ty, hồ sơ năng lực, dự án và câu chuyện khách hàng thực tế." },
        { title: "Công ty bán gì → inputs/02_marketing_materials", body: "Brochure, giới thiệu sản phẩm/dịch vụ, bảng giá." }
      ] },
      { id: "copy", title: "Sao chép và dán", steps: [
        { title: "Sao chép tệp", body: "Mở nơi chứa tài liệu, chọn tệp, nhấn Ctrl + C (Windows) hoặc Command + C (Mac)." },
        { title: "Dán vào đúng thư mục", body: "Mở thư mục workflow → inputs → thư mục tương ứng, nhấn Ctrl + V hoặc Command + V." }
      ], note: { title: "Định dạng nên dùng", body: "PDF, Word, Excel có chữ chọn được. Ảnh scan có thể không đọc được; Claude sẽ báo ở bước 4." } },
      { id: "ready", title: "Xong khi", checks: ["Hồ sơ công ty nằm trong inputs/01_company_info.", "Tài liệu sản phẩm nằm trong inputs/02_marketing_materials."] }
    ]
  },
  {
    slug: "mo-claude-code", title: "Mở workflow bằng Claude Code", shortTitle: "Mở bằng Claude Code", actor: "Bạn làm trên máy",
    description: "Dùng tab Code trong Claude Desktop, chọn Local và thư mục workflow. Không dùng tab Chat.",
    sections: [
      { id: "install", title: "Cài Claude Desktop", paragraphs: ["Tải tại claude.ai/download, cài và đăng nhập. Tab Code cần gói Pro, Max, Team hoặc Enterprise. Không cần cài thêm Node.js hay CLI."] },
      { id: "code", title: "Chọn tab Code", paragraphs: ["Ở góc trên bên trái, bấm biểu tượng </> (Code)."] },
      { id: "folder", title: "Chọn Local và thư mục workflow", steps: [
        { title: "Kiểm tra đang ở Local", body: "Local nghĩa là làm việc trên máy bạn." },
        { title: "Bấm No folder → Open folder…", body: "Chọn thư mục workflow đã giải nén ở bước 1." }
      ] },
      { id: "open-folder", title: "Menu chọn thư mục" },
      { id: "permissions", title: "Chọn quyền Manual", paragraphs: ["Ở chế độ Manual, Claude hỏi trước khi sửa tệp hoặc chạy lệnh. Đọc yêu cầu rồi bấm cho phép nếu đúng việc bạn nhờ. Không cần chọn Bypass permissions."] },
      { id: "ready", title: "Xong khi", checks: ["Tôi đang ở tab Code, môi trường Local.", "Nút No folder đã đổi thành tên thư mục workflow."] }
    ]
  },
  {
    slug: "doc-tai-lieu", title: "Yêu cầu Claude đọc tài liệu inputs", shortTitle: "Claude đọc tài liệu", actor: "Bạn yêu cầu Claude",
    description: "Claude đọc tài liệu bạn đã đặt, tóm tắt doanh nghiệp và hỏi phần còn thiếu.",
    sections: [
      { id: "send", title: "Gửi câu này cho Claude", paragraphs: ["Dán vào ô nhập trong tab Code rồi nhấn Enter. Claude sẽ báo tệp nào đọc được, tệp nào không."], prompt: "Hãy đọc CLAUDE.md và tài liệu trong inputs. Báo tệp nào đọc được, tệp nào không, rồi tóm tắt doanh nghiệp của tôi. Nếu thiếu thông tin, hỏi tôi từng câu. Tôi ít quen công nghệ, hãy hướng dẫn từng bước." },
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
      { id: "approve", title: "Duyệt từng thao tác", steps: [
        { title: "Đọc giải thích của Claude", body: "Chưa hiểu thì trả lời: “Giải thích đơn giản hơn”." },
        { title: "Bấm cho phép khi ứng dụng hỏi", body: "Chỉ cho phép lệnh đúng việc Claude vừa giải thích." },
        { title: "Tự làm phần Claude nhờ", body: "Ví dụ mở trình cài Python hoặc nhập mật khẩu máy. Không gửi mật khẩu vào chat." }
      ] },
      { id: "ready", title: "Xong khi", checks: ["Claude báo môi trường đã đủ bằng kết quả kiểm tra thật."] }
    ]
  },
  {
    slug: "ket-noi-mcp", title: "Yêu cầu Claude kết nối công cụ (MCP)", shortTitle: "Claude kết nối công cụ", actor: "Bạn yêu cầu Claude",
    description: "Kết nối trình duyệt CloakBrowser và TinaCRM để Claude tìm khách và lưu vào CRM.",
    sections: [
      { id: "browser", title: "Kết nối trình duyệt CloakBrowser", paragraphs: ["Claude tự thêm cấu hình vào tệp .mcp.json trong thư mục workflow. Khi được nhắc, mở lại session để công cụ được nạp."], prompt: "Hãy kết nối CloakBrowser cho Claude Code qua tệp .mcp.json trong thư mục này, rồi mở thử một trang web công khai để kiểm tra." },
      { id: "tinacrm", title: "Kết nối TinaCRM", steps: [
        { title: "Gửi câu mẫu", body: "Claude sẽ hỏi địa chỉ TinaCRM của doanh nghiệp bạn." },
        { title: "Tự đăng nhập khi được yêu cầu", body: "Đăng nhập và cấp quyền trên màn hình TinaCRM. Nếu cần khóa API, nhờ quản trị viên tạo trong Settings → MCP & APIs. Không dán khóa vào chat." },
        { title: "Để Claude đọc thử", body: "Claude xác nhận đúng doanh nghiệp và đọc các ô thông tin khách, chưa ghi dữ liệu." }
      ], prompt: "Hãy kết nối TinaCRM với Claude Code. Hỏi tôi địa chỉ TinaCRM trước, hướng dẫn tôi đăng nhập từng bước, rồi đọc thử các ô thông tin khách hàng. Chưa tạo, sửa hay xóa dữ liệu. Không yêu cầu mật khẩu hoặc khóa trong chat." },
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
      { id: "routine", title: "Mỗi sáng gửi câu này", paragraphs: ["Mở tab Code, chọn session cũ hoặc tạo session mới với Local và đúng thư mục workflow."], prompt: "Tiếp tục chiến dịch. Kiểm tra phản hồi mới, tìm khách theo mục tiêu đã chốt và gửi các email đến hạn trong phạm vi tôi đã cho phép. Báo rõ phần nào chưa chạy được." },
      { id: "review", title: "Bạn chỉ cần xem", steps: [
        { title: "Khách nào cần trả lời", body: "Người phụ trách liên hệ tiếp." },
        { title: "Danh sách mới có đúng hướng", body: "Lệch thì nói Claude chỉnh tiêu chí." },
        { title: "Việc đang chờ bạn", body: "Ví dụ đăng nhập lại hoặc xác minh." }
      ] },
      { id: "outputs", title: "Kết quả lưu ở đâu?", paragraphs: ["Trong thư mục outputs: 01_icp_criteria (tiêu chí), 02_crawled_leads (danh sách khách), 03_email_cadence (kế hoạch email), 04_weekly_reports (báo cáo). Tiến trình được lưu ở config/workflow_progress.md để lần sau Claude làm tiếp."] },
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
      { question: "Tôi có phải gửi mật khẩu cho Claude không?", answer: "Không. Bạn tự nhập mật khẩu và mã xác minh trên màn hình đăng nhập. Không gửi mật khẩu, cookie hay khóa vào chat." },
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
