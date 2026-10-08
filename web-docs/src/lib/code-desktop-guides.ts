import type { Guide } from "./guides";

export const codeDesktopGuides: Record<string, Guide> = {
  "claude-desktop": {
    slug: "claude-desktop", title: "Mở đúng Claude Code trong Desktop", shortTitle: "Mở tab Code trong Desktop", group: "Làm quen", minutes: 6,
    description: "Chọn Code → Local → thư mục workflow. Claude có thể đọc tệp và chạy lệnh theo quyền bạn cho phép.",
    sections: [
      { id: "install", title: "Cài Claude Desktop và đăng nhập", steps: [
        { title: "Tải ứng dụng chính thức", body: "Mở claude.ai/download, cài bản phù hợp với máy và đăng nhập. Nếu đã cài, cập nhật phiên bản mới khi cần." },
        { title: "Kiểm tra quyền dùng Claude Code", body: "Theo hướng dẫn chính thức, Code yêu cầu gói Pro, Max, Team hoặc Enterprise. Nếu ứng dụng yêu cầu nâng cấp hoặc quản trị viên chưa cho phép, xử lý tài khoản trước." }
      ], note: { title: "Không cần cài CLI để mở tab Code", body: "Claude Desktop đã tích hợp Claude Code. Node.js/Python chỉ cần nếu công cụ workflow cụ thể yêu cầu, không phải điều kiện để mở tab Code." } },
      { id: "code", title: "Chọn tab Code, không chọn Chat", paragraphs: ["Ở phía trên ứng dụng, chọn Code. Chat dành cho hội thoại thông thường; bài hướng dẫn này dùng Code để làm việc trực tiếp với thư mục trên máy.", "Bạn vẫn trao đổi bằng tiếng Việt bình thường. Dù tên là Code, bạn không cần tự viết mã để nhờ Claude đọc tài liệu hoặc thiết lập công cụ."], note: { title: "Không thấy tab Code?", body: "Kiểm tra cập nhật, đăng nhập và gói tài khoản. Tên và vị trí có thể đổi theo phiên bản. Đối chiếu hướng dẫn chính thức tại code.claude.com/docs/en/desktop-quickstart." } },
      { id: "folder", title: "Chọn Local và thư mục workflow", steps: [
        { title: "Chọn môi trường Local", body: "Local là chạy trên máy bạn. Không chọn Cloud hoặc SSH trong luồng hướng dẫn này." },
        { title: "Bấm No folder hoặc Select folder", body: "Trên phiên bản trong ảnh, khi chưa chọn thư mục, nút hiển thị No folder ngay cạnh Local. Bấm nút đó để chọn thư mục workflow đã giải nén, nơi có CLAUDE.md, inputs, outputs và .claude. Phiên bản khác có thể ghi Select folder. Không chọn ZIP, thư mục Downloads chung hoặc riêng web-docs." },
        { title: "Dùng thư mục gốc đang chứa tài liệu", body: "Nếu giao diện hỏi worktree/bản tách riêng, dùng thư mục gốc cho workflow này. Bản tách có thể không chứa tài liệu và cấu hình cục bộ của bạn." }
      ] },
      { id: "open-folder", title: "Trong menu, chọn Open folder…", paragraphs: ["Bấm No folder để mở menu. Chọn Open folder… ở cuối menu, rồi trong cửa sổ của máy tìm thư mục workflow đã giải nén và xác nhận mở.", "Danh sách Recent là những thư mục từng mở trên máy. Nếu đã thấy đúng crm-lead-workflow, bạn có thể chọn trực tiếp; nếu có nhiều bản cùng tên, dùng Open folder… để kiểm tra đúng vị trí. Khi hoàn tất, nút No folder phải đổi thành tên thư mục đã chọn."] },
      { id: "add-folder", title: "Thêm thư mục tài liệu vào phiên làm việc", paragraphs: ["Nếu tài liệu nằm ngoài thư mục workflow, bạn có thể thêm thư mục đó để Claude làm việc với nó. Nếu tài liệu đã ở inputs thì không cần thêm. Chỉ thêm tài liệu thuộc doanh nghiệp hiện tại."], steps: [
        { title: "Tìm nút thư mục có dấu cộng", body: "Trong tab Code, nhìn phía trên ô nhập yêu cầu. Bên cạnh tên thư mục và lựa chọn nhánh/worktree có nút hình thư mục với dấu cộng. Di chuột lên nút: phiên bản trong ảnh hiện Add another folder (Thêm thư mục khác)." },
        { title: "Bấm nút và chọn thư mục", body: "Trong cửa sổ chọn thư mục, mở nơi bạn đang cất tài liệu. Ví dụ: Documents → Tài liệu công ty. Chọn thư mục đó rồi bấm nút xác nhận của cửa sổ, có thể là Open hoặc Select folder tùy hệ điều hành." },
        { title: "Kiểm tra thư mục đã được thêm", body: "Kiểm tra giao diện hiển thị thư mục mới hoặc yêu cầu Claude xác nhận các thư mục truy cập được. Nếu ứng dụng hỏi quyền, đọc yêu cầu và cho phép khi đúng thư mục bạn muốn dùng." },
        { title: "Nói rõ tài liệu cần đọc", body: "Gửi câu mẫu dưới, thay tên thư mục bằng tên thật. Không chỉ nói “đọc tài liệu” nếu có nhiều thư mục. Thêm thư mục không tự chuyển các tệp vào inputs." }
      ], prompt: "Tôi vừa thêm thư mục [tên thư mục tài liệu] vào phiên này. Hãy kiểm tra bạn truy cập được và liệt kê các tài liệu trong đó. Sau đó đọc tài liệu về công ty, báo tệp nào chưa đọc được và hỏi tôi phần còn thiếu. Chỉ đọc, chưa sửa hoặc di chuyển tệp.", note: { title: "Không thấy nút thêm thư mục?", body: "Kiểm tra đang ở Code và Local. Giao diện có thể khác theo phiên bản. Bạn có thể tự sao chép tài liệu vào inputs của workflow như bài Đặt tài liệu đúng chỗ, hoặc gửi ảnh màn hình để được hướng dẫn. Thêm một thư mục tài liệu không thay thư mục gốc workflow đang dùng." } },
      { id: "permissions", title: "Chọn quyền và bắt đầu", steps: [
        { title: "Chọn Manual khi mới làm quen", body: "Claude hỏi trước khi sửa tệp hoặc chạy lệnh. Tên cũ có thể là Ask permissions. Đọc thao tác sắp làm rồi đồng ý nếu đúng yêu cầu của bạn." },
        { title: "Gửi yêu cầu đầu tiên", body: "Dán câu mẫu dưới. Claude đọc hướng dẫn trong thư mục và kiểm tra khả năng thực tế trước khi tiếp tục." },
        { title: "Chấp thuận từng thao tác cần thiết", body: "Nếu Claude cần chạy lệnh cài công cụ, ứng dụng có thể hiện yêu cầu cấp quyền. Nếu chưa hiểu, hỏi giải thích trước. Không cần chọn Bypass permissions." }
      ], prompt: "Tôi muốn dùng workflow trong thư mục đang mở. Hãy đọc CLAUDE.md và kiểm tra tài liệu trong inputs. Tôi ít quen công nghệ: hỏi từng câu đơn giản. Trước khi cài công cụ, giải thích việc cần làm; dùng quyền được cấp để thực hiện và báo kết quả thật. Chưa gửi email hoặc ghi dữ liệu vào CRM." },
      { id: "files", title: "Claude đọc tài liệu trên máy thế nào?", paragraphs: ["Trong session Local, Claude Code có công cụ đọc tệp và chạy lệnh theo quyền được cấp. Không cần filesystem MCP chỉ để đọc thư mục đã chọn.", "Đặt tài liệu công ty vào inputs/01_company_info và sản phẩm vào inputs/02_marketing_materials. Bạn có thể dùng @tên-tệp hoặc đính kèm khi thích hợp. PDF quét, Word và slide có thể cần công cụ trích xuất riêng."], prompt: "Hãy đọc tài liệu trong inputs/01_company_info và inputs/02_marketing_materials. Báo những tệp đã đọc được, những tệp cần công cụ bổ sung và tóm tắt doanh nghiệp. Nếu thiếu thông tin, hỏi tôi từng câu." },
      { id: "session", title: "Quay lại công việc lần sau", paragraphs: ["Mở tab Code và chọn session đang làm trong danh sách bên trái. Nếu tạo session mới, chọn lại Local và đúng thư mục doanh nghiệp.", "Không dùng hướng dẫn Projects/Add to project của tab Chat để chọn thư mục Code. Claude Code đọc CLAUDE.md và các skill trong .claude/skills của repository, theo cấu hình và chính sách của môi trường."] }
    ]
  },
  "cai-moi-truong": {
    slug: "cai-moi-truong", title: "Để Claude Code hỗ trợ thiết lập", shortTitle: "Thiết lập công cụ với Code", group: "Làm quen", minutes: 6,
    description: "Claude Code kiểm tra môi trường và chạy lệnh được cho phép. Bạn xử lý đăng nhập và những bước cài đặt cần thao tác ngoài ứng dụng.",
    sections: [
      { id: "check", title: "Kiểm tra trước, chỉ cài phần cần thiết", paragraphs: ["Mở Code → Local → đúng thư mục workflow trước. Claude Code có thể kiểm tra Python, Node.js và công cụ hiện có bằng lệnh trên máy.", "Không cần cài Node.js hoặc Claude CLI chỉ để sử dụng tab Code. CloakBrowser dùng Python; công cụ khác có thể cần Node.js. Claude phải kiểm tra trước khi đề xuất cài."], prompt: "Hãy kiểm tra môi trường cho workflow trong session Local này. Đọc các tệp cấu hình, kiểm tra công cụ hiện có và nói ngắn phần nào cần bổ sung. Chưa cài gì trước khi giải thích cho tôi." },
      { id: "install", title: "Nhờ Claude cài dependencies của workflow", steps: [
        { title: "Xem giải thích", body: "Claude đề xuất những công cụ còn thiếu và cách cài phù hợp với hệ điều hành. Nếu chưa hiểu, nói “Giải thích đơn giản hơn”." },
        { title: "Cho phép lệnh đúng mục đích", body: "Trong Manual, bạn duyệt lệnh khi ứng dụng hỏi. Claude có thể tạo môi trường .venv-browser và cài dependencies từ config/requirements-browser.txt." },
        { title: "Tự làm bước ngoài quyền của Claude", body: "Nếu chưa có Python, cần mở trình cài đặt, nhập quyền quản trị hoặc đăng nhập, Claude hướng dẫn bạn từng thao tác. Không đưa mật khẩu hay OTP vào chat." }
      ], prompt: "Hãy giúp tôi thiết lập CloakBrowser theo workflows/CLOAKBROWSER.md. Kiểm tra trước, giải thích phần cần cài, rồi chạy lệnh trong phạm vi tôi cho phép. Nếu cần tôi làm thao tác ngoài ứng dụng, hỏi từng bước. Không báo thành công khi chưa kiểm tra." },
      { id: "mcp", title: "Kết nối công cụ cho Claude Code", paragraphs: ["MCP của Claude Code dùng cấu hình và cơ chế kết nối của Code, không phải mặc định tệp claude_desktop_config.json dành cho Chat. Claude có thể hỗ trợ đăng ký công cụ với cấu hình project .mcp.json hoặc lệnh claude mcp nếu CLI có sẵn; không mặc định CLI đã được cài.", "CloakBrowser cần server cục bộ chạy bằng Python và đường dẫn script đúng. TinaCRM ưu tiên native MCP. Quyền kết nối và thao tác vẫn cần được kiểm tra trong chính session Code."], prompt: "Hãy kiểm tra cách cấu hình MCP cho Claude Code trong phiên này, không dùng cấu hình Chat thay thế. Giúp tôi kết nối CloakBrowser và TinaCRM theo tài liệu project; kiểm tra server/tool sau khi cấu hình. Hướng dẫn tôi đăng nhập trực tiếp nếu cần, không yêu cầu secret trong chat." },
      { id: "test", title: "Chạy thử trước khi dùng thật", checks: ["Session đang ở tab Code và môi trường Local.", "Claude đọc được CLAUDE.md và tài liệu đúng thư mục.", "CloakBrowser mở được trang thử bằng công cụ được kết nối.", "Kết nối TinaCRM đã đọc thử, chưa ghi dữ liệu thật.", "Claude nói rõ công cụ email/lịch nào còn thiếu."], note: { title: "Có shell không đồng nghĩa mọi tích hợp đã sẵn sàng", body: "Claude Code có thể chạy lệnh, nhưng kết nối CRM/email, token, thư viện và lịch vẫn phải thiết lập. Không suy ra workflow hoàn chỉnh chỉ vì session đã mở." } }
    ]
  },
  "thiet-lap": {
    slug: "thiet-lap", title: "Thiết lập workflow lần đầu", shortTitle: "Thiết lập lần đầu", group: "Làm quen", minutes: 5,
    description: "Tải workflow, đặt tài liệu, mở thư mục trong Code và để Claude hướng dẫn thiết lập từng phần.",
    sections: [
      { id: "project", title: "Thứ tự chuẩn bị đúng", steps: [
        { title: "Tải và giải nén workflow", body: "Làm theo bài Tải workflow. Mỗi doanh nghiệp dùng một bản thư mục riêng." },
        { title: "Tự đặt tài liệu vào inputs", body: "Hồ sơ công ty vào 01_company_info, sản phẩm/dịch vụ vào 02_marketing_materials." },
        { title: "Mở Code → Local → Select folder", body: "Chọn thư mục gốc workflow đã giải nén, không mở project Chat. Hướng dẫn và skills có trong thư mục." },
        { title: "Yêu cầu Claude kiểm tra và thiết lập", body: "Claude Code đọc tệp, đề xuất việc cần làm và có thể chạy lệnh sau khi được cho phép. Bạn xử lý đăng nhập và thao tác thủ công được yêu cầu." }
      ] },
      { id: "verify", title: "Câu bắt đầu thiết lập", prompt: "Hãy đọc CLAUDE.md và hướng dẫn workflow trong thư mục này. Giúp tôi thiết lập từng bước: kiểm tra tài liệu, CloakBrowser, TinaCRM, hộp thư và khả năng chạy lịch. Tôi dùng Claude Code Local trong Desktop. Bạn có thể chạy lệnh trong quyền tôi cho phép; trước mỗi thay đổi quan trọng hãy giải thích đơn giản. Chưa gửi email thật hoặc nhập lead thật." },
      { id: "ready", title: "Kiểm tra đã mở đúng", checks: ["Tôi đang ở tab Code, không phải Chat.", "Môi trường là Local và thư mục là bản workflow của doanh nghiệp.", "Claude đã đọc được hướng dẫn và tài liệu trong inputs.", "Claude đã báo công cụ nào thực sự hoạt động và phần nào chưa có."] }
    ]
  }
};
