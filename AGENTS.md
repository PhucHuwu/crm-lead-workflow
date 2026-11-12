# Workflow tìm và chăm sóc khách hàng cho nhiều doanh nghiệp

## Môi trường mục tiêu

Tệp này là chỉ dẫn chung cho mọi trợ lý AI chạy trên máy người dùng, thư mục gốc là thư mục workflow này. Hỗ trợ ngang nhau hai môi trường:

- **Claude Code** trong Claude Desktop: tab Code → This computer (bản cũ ghi Local) → chọn thư mục. Claude đọc tệp này qua `CLAUDE.md`.
- **Codex** trong ChatGPT desktop app: Codex → chọn thư mục dự án, chạy trên máy (Local, không dùng worktree hay cloud). Codex tự đọc tệp này.

Không dùng Chat Projects (Claude) hay ChatGPT Projects/custom instructions làm cơ chế mặc định; không cài `claude_desktop_config.json`.

Khi nói với người dùng, gọi mình là “trợ lý”; chỉ nêu tên Claude hay ChatGPT/Codex khi chỉ chỗ bấm. Tài liệu trong repo viết “trợ lý” cho cả hai; chỗ nào thao tác khác nhau có mục “Claude Code” / “Codex” riêng.

### Khác biệt cần biết

| Việc | Claude Code | Codex (ChatGPT desktop) |
|---|---|---|
| Skill | `.claude/skills/` (bản sao) | `.agents/skills/` (bản gốc) |
| Hỏi người dùng | Công cụ hỏi lựa chọn nếu có, không thì câu hỏi đánh số | Câu hỏi đánh số trong chat |
| Lệnh cần mạng (TinaCRM, cập nhật workflow) và hộp thoại nhập khóa | Hỏi quyền; bấm Always allow cho `python3 scripts/…`, `sh scripts/…` | Sandbox mặc định chặn mạng và có thể chặn cửa sổ hộp thoại: xin chạy ngoài sandbox, người dùng duyệt luôn cho đúng lệnh đó. Xem `workflows/ASSISTANT_SETUP.md`. |
| Cào dữ liệu web | Trình duyệt trong ứng dụng (khung Browser; bấm Always allow cho từng trang) | Trình duyệt trong ứng dụng (`@Browser`; cho phép từng trang) |
| Đọc web nhanh, ThongtinCty | WebSearch/WebFetch có sẵn; lệnh `scripts/fetch_page.py`, `scripts/thongtincty.py` (bấm Always allow) | Tìm kiếm web có sẵn; cùng lệnh, được `.codex/rules/workflow.rules` cho phép khi thư mục đã tin cậy |
| Gửi/đọc email | Lệnh `scripts/outlook_mail.py` qua Outlook classic trên máy (bấm Always allow; macOS hỏi điều khiển Outlook thì bấm OK) | Cùng lệnh, được `.codex/rules/workflow.rules` cho phép |
| Gmail, Calendar, Drive, Apollo… (dự phòng) | Connector của Claude (thẻ Connect trong chat) | Plugin của ChatGPT (tab Plugins trong ChatGPT desktop app) |
| Đặt lịch | Scheduled task của Claude Desktop | Scheduled của ChatGPT desktop app |
| Vai trò `subagents/` | Có thể giao cho subagent | Chỉ tạo subagent khi người dùng yêu cầu; mặc định tự làm tuần tự theo vai trò |
| Nhiều chiến dịch | Cùng một phiên, chuyển bằng câu “Làm chiến dịch <tên>” | Cùng một cuộc trò chuyện, như bên trái |

Gọi lệnh trên Codex: mỗi lần một lệnh đơn giản, không nối bằng `&&`, `|`, `>` hay biến môi trường, để quy tắc duyệt theo tiền tố (`python3 scripts/…`) khớp được.

Skill được sửa ở `.agents/skills/`, rồi chạy `python3 scripts/sync_skills.py` để chép sang `.claude/skills/`. Không sửa trực tiếp `.claude/skills/`.

Bạn có thể đọc/ghi tệp và chạy lệnh theo công cụ, quyền và chính sách thực tế. Kiểm tra trước khi cài dependencies; giải thích ngắn khi cần quyền, báo kết quả thật. Các bước đăng nhập, mật khẩu/OTP hoặc thao tác ngoài quyền phải để người dùng làm trực tiếp. Không mặc định cần Node.js hoặc CLI để mở workflow.

## Hướng dẫn vận hành

- **Dẫn dắt theo `workflows/USER_GUIDE_FLOW.md`**: chu trình 11 bước giống trang hướng dẫn, câu mở đầu, cách nhận diện câu mẫu và tên gọi khớp với trang hướng dẫn người dùng đã đọc. Người dùng đã tự tải workflow, tự đặt tài liệu vào `inputs` và mở thư mục bằng trợ lý trên máy trước khi gặp bạn (bước 3, `workflows/ASSISTANT_SETUP.md`).
- Mở đầu mỗi phiên: kiểm tra `config/workflow_progress.md`, `inputs/`, `config/business.json`, `product-marketing.md` và `campaigns/` trước khi hỏi. Cập nhật `config/workflow_progress.md` (bước 1–6) hoặc `campaigns/<slug>/progress.md` (bước 7–10) sau mỗi giai đoạn và khi kết thúc phiên.
- **Làm mọi việc trong cùng một phiên. Không bao giờ nhờ người dùng mở phiên/cuộc trò chuyện mới (+ New)**: kết nối (connector, quyền đã cho) và ngữ cảnh không chuyển sang phiên khác. Hôm sau làm tiếp thì người dùng mở lại đúng phiên cũ ở thanh bên trái. Chỉ lần chạy theo lịch mới tự tạo phiên riêng (`workflows/SCHEDULING.md`).
- **Chiến dịch theo `workflows/CAMPAIGNS.md`**: làm lần lượt từng chiến dịch trong cùng phiên, chỉ ghi vào `campaigns/<slug>/` của chiến dịch đang làm; đường dẫn `outputs/01…03` trong tài liệu khác hiểu là trong chiến dịch đang làm. Báo cáo tuần (`outputs/04_weekly_reports/`) tổng hợp mọi chiến dịch.
- Đọc `CLAUDE_PROJECT_INSTRUCTIONS.md` để biết chi tiết nghiệp vụ từng bước; quy tắc môi trường trong tệp AGENTS.md này và `USER_GUIDE_FLOW.md` ưu tiên khi tài liệu cũ mâu thuẫn.
- Áp dụng `rules/nontechnical_user_experience.md`: hỏi từng câu đơn giản, lựa chọn đánh số, không yêu cầu người dùng tự biết phải hỏi gì.
- Tài liệu công ty ở `inputs/01_company_info/`, sản phẩm ở `inputs/02_marketing_materials/`. Người dùng tự đặt tài liệu; bạn đọc và báo tệp nào không trích xuất được.
- Skills: `.agents/skills/` (Claude dùng bản sao ở `.claude/skills/`). Khi một bước ghi “theo skill `<tên>`”, đọc `SKILL.md` của skill đó trước khi làm, kể cả khi công cụ không tự gợi ý skill. Dữ liệu, ngữ cảnh và cấu hình riêng cho từng doanh nghiệp, không dùng dữ liệu doanh nghiệp khác.
- Kết nối TinaCRM theo `workflows/TINACRM_CONNECTION.md`; lấy dữ liệu web theo `workflows/WEB_RESEARCH.md` (trình duyệt trong ứng dụng là chính; thử lần lượt từng cách, cách nào không được thì chuyển cách khác).
- **Cập nhật workflow** (“Cập nhật workflow”) theo `workflows/UPDATING.md`: chạy script cập nhật, không bắt người dùng tải lại ZIP hay chép lại tài liệu. **Mỗi lần chạy hằng ngày (bước 10, kể cả theo lịch): cập nhật trước, nếu có bản mới thì đọc lại hướng dẫn và skill đã đổi, rồi mới làm việc.**
- Không cài trình duyệt riêng (CloakBrowser đã bỏ): dùng trình duyệt có sẵn trong ứng dụng. ThongtinCty là lệnh `python3 scripts/thongtincty.py …` theo `workflows/CONNECTORS.md`; không thêm máy chủ MCP vào `.mcp.json` / `.codex/config.toml` (máy chủ mới chỉ nạp ở phiên mới). **TinaCRM chỉ dùng REST API qua `scripts/tinacrm_rest.py`, không dùng MCP.** Dịch vụ khác (Gmail, Google Calendar, Apollo…) theo `workflows/CONNECTORS.md`: trên Claude, hiện thẻ Connect trong chat để người dùng bấm Connect; trên Codex, hướng dẫn người dùng bật plugin ở tab Plugins của ChatGPT desktop app. Không bắt người dùng thêm custom connector hay sửa tệp cấu hình. Filesystem MCP không bắt buộc để đọc project Local. Không ghi secret vào cấu hình được commit hoặc chat.
- **Đặt lịch chạy tự động** theo `workflows/SCHEDULING.md`: trợ lý tự tạo lịch chạy trên máy trong phiên (Claude Desktop hoặc ChatGPT desktop app), chỉ hỏi người dùng giờ chạy và cách duyệt email; chỉ hướng dẫn người dùng vào trang Scheduled khi phiên không có công cụ tạo lịch.
- **Workflow phụ: trang quản trị nội bộ** theo `workflows/ADMIN_SITE.md` (đăng bài chuẩn SEO theo skill `seo-article`, sửa bài, nhập liệu…): người dùng tự đăng nhập trong khung trình duyệt của ứng dụng, trợ lý tìm đúng tab đó và thao tác. Chỉ đăng/sửa sau khi người dùng duyệt trong chat; không xóa, không đổi cài đặt trang. Mỗi bài là một bản ghi “Bài viết” trên TinaCRM (đề xuất chủ đề từ dữ liệu khách, trạng thái, task gửi bài cho sale, báo cáo tuần); trợ lý tự tạo object này sau khi hỏi một lần. Không thuộc 11 bước, làm được bất cứ lúc nào sau bước 4.
- **Gửi email** theo `workflows/EMAIL_SENDING.md`: ưu tiên ứng dụng Outlook bản cũ (classic) trên máy qua `scripts/outlook_mail.py`; không được thì connector có sẵn, cuối cùng là tệp `.eml` để người dùng tự bấm Gửi. Không bắt người dùng kết nối connector Microsoft 365.
- Chưa gửi email, nhập lead hay tạo lịch trước khi các công cụ và phạm vi được thiết lập. Không coi script demo là nguồn lead thật.
