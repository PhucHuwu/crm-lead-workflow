# Kết nối dịch vụ khác (connector)

Làm ở bước 6, sau CloakBrowser và TinaCRM. Mục đích: kết nối sẵn những dịch vụ các bước sau sẽ cần, để lúc tìm khách, gửi email hay chạy theo lịch không phải dừng lại chờ người dùng đăng nhập.

Người dùng chỉ bấm kết nối và đăng nhập; cách bấm khác nhau theo công cụ (`config/business.json` → `assistant`):

- **Claude Code:** trợ lý hiện thẻ Connect trong chat, người dùng bấm Connect. Gọi là “connector”.
- **Codex:** người dùng bật plugin ở tab **Plugins** của ChatGPT desktop app. Gọi là “plugin”.

Không bắt người dùng sao chép địa chỉ hay thêm custom connector. Trợ lý không nhận mật khẩu, mã OTP hay token qua chat. Dịch vụ đã kết nối dùng được ở mọi phiên của tài khoản đó, mọi thư mục doanh nghiệp.

## Đề xuất

Chỉ đề xuất những gì doanh nghiệp này sẽ dùng, dựa trên `product-marketing.md`, `config/business.json` và câu trả lời trước đó. Không đề xuất cả danh sách.

| Dịch vụ | Dùng ở | Đề xuất khi |
|---|---|---|
| Gmail | Bước 9–10: gửi email, đọc phản hồi | Hộp thư liên hệ khách là Gmail/Google Workspace |
| Microsoft 365 (Outlook, lịch) | Bước 9–10 | Hộp thư là Outlook/Microsoft 365 |
| Google Calendar | Bước 10: đặt lịch hẹn khi khách đồng ý gặp, tìm giờ trống | Doanh nghiệp hẹn gặp/demo với khách và dùng Google |
| Apollo.io | Bước 8: tìm công ty, người quyết định, bổ sung email | Khách là doanh nghiệp (B2B) và người dùng **đã có** tài khoản Apollo |
| Google Drive | Bước 4: đọc tài liệu doanh nghiệp | Tài liệu nằm trên Drive thay vì thư mục `inputs/` |
| Apify | Bước 8: lấy danh sách doanh nghiệp từ Google Maps, dữ liệu công ty Việt Nam | Khách là cửa hàng, cơ sở địa phương (Maps) hoặc cần danh sách lớn. Cần tài khoản Apify, chạy tốn credit |
| ThongtinCty | Bước 8: tra mã số thuế, địa chỉ, người đại diện, ngành nghề của doanh nghiệp Việt Nam | Khách là doanh nghiệp tại Việt Nam. Miễn phí, không cần tài khoản, **không cần người dùng kết nối** (mục dưới) |

Chỉ đề xuất dịch vụ có trong danh bạ của công cụ đang dùng (Claude: hiện được thẻ Connect; Codex: có trong tab Plugins), riêng ThongtinCty trợ lý tự thêm. Dịch vụ người dùng nhắc tới mà không có trong danh bạ (ví dụ Hunter): nói rõ là chưa hỗ trợ kết nối đơn giản, đề xuất dịch vụ thay thế có trong danh bạ. Không chắc dịch vụ có trong tab Plugins không thì nhờ người dùng tìm thử, không khẳng định.

Không đề xuất: CRM khác (HubSpot, Salesforce, Pipedrive…) vì trùng TinaCRM; Zapier/Make/n8n; công cụ nhắn tin LinkedIn tự động.

Hỏi một lượt, cho chọn nhiều: “Bạn muốn kết nối sẵn dịch vụ nào? 1. Gmail (gửi email cho khách). 2. Google Calendar (đặt lịch hẹn). 3. Apollo (tìm khách). 4. Để sau.” Mỗi lựa chọn một dòng lý do ngắn. Không đưa ThongtinCty vào câu hỏi.

Lưu ý khi đề xuất Apollo, nói trước khi người dùng kết nối:
- Cần tài khoản Apollo đăng nhập bằng email công ty (không nhận Gmail/Yahoo cá nhân).
- Trên Claude, Apollo yêu cầu tắt tùy chọn cho Anthropic dùng dữ liệu để huấn luyện (Claude: Settings → Privacy) trước khi kết nối. Trên Codex, làm theo yêu cầu hiện ra khi bật plugin.
- Một số thao tác (bổ sung email/số điện thoại) trừ credit của gói Apollo; tìm kiếm thì không lộ email.

## Hướng dẫn kết nối

### Claude Code

1. Dùng công cụ gợi ý connector (suggest connectors) của phiên để hiện thẻ “Suggested connectors” cho **tất cả** dịch vụ người dùng đã chọn, trong một lần.
2. Nói một câu: “Bấm Connect trên từng dịch vụ ở thẻ trên, đăng nhập nếu được hỏi rồi bấm cho phép. Xong báo mình.” Gmail/Calendar: thêm “chọn đúng tài khoản Google dùng để liên hệ khách”.
3. Người dùng báo xong: kiểm tra (mục dưới). Không thấy công cụ của dịch vụ trong phiên này thì nhờ mở phiên mới (+ New) cùng thư mục, rồi kiểm tra lại.

Sự cố:
- Không hiện được thẻ (phiên không có công cụ gợi ý connector): hướng dẫn một câu “Bấm dấu + cạnh ô nhập → Connectors → Browse connectors → tìm <tên dịch vụ> → Connect.”
- Gói Team/Enterprise: thẻ hiện nút Request thay vì Connect thì người dùng bấm Request, chờ quản trị tài khoản Claude bật. Google Workspace báo “admin needs to review”: quản trị Google Workspace phải cho phép ứng dụng Claude.

### Codex (ChatGPT desktop app)

1. Hướng dẫn từng thao tác, mỗi dịch vụ một lượt: mở tab **Plugins** ở thanh bên ChatGPT desktop app → tìm <tên dịch vụ> → bấm cài/kết nối → đăng nhập và cho phép. Gmail/Calendar: thêm “chọn đúng tài khoản Google dùng để liên hệ khách”.
2. Hỏi “Bạn kết nối xong chưa? 1. Rồi. 2. Không tìm thấy dịch vụ. 3. Báo lỗi.”
3. Người dùng báo xong: nhờ mở cuộc trò chuyện Codex mới cùng thư mục (Local) nếu công cụ của dịch vụ chưa có trong cuộc trò chuyện này, rồi kiểm tra (mục dưới).

Sự cố:
- Không tìm thấy dịch vụ trong Plugins: ghi `status = "skipped"`, đề xuất dịch vụ thay thế; không hướng dẫn tự dựng máy chủ MCP.
- Tài khoản ChatGPT doanh nghiệp (Business/Enterprise): plugin có thể cần quản trị bật trước. Google Workspace báo cần quản trị duyệt: quản trị Google Workspace phải cho phép ứng dụng ChatGPT.

### ThongtinCty (trợ lý tự thêm)

Khách là doanh nghiệp Việt Nam thì trợ lý tự thêm vào cấu hình MCP của thư mục workflow (giữ nguyên các server đã có), không hỏi người dùng thêm bước nào. Không cần đăng nhập.

- **Claude Code:** `.mcp.json`

  ```json
  "thongtincty": { "type": "http", "url": "https://thongtincty.com/mcp" }
  ```

  Phiên mới sẽ hỏi cho phép dùng server trong `.mcp.json`: nói trước “Phiên sau nếu ứng dụng hỏi cho dùng thongtincty, bấm cho phép.”

- **Codex:** `.codex/config.toml` (chỉ được đọc khi thư mục đã được tin cậy)

  ```toml
  [mcp_servers.thongtincty]
  url = "https://thongtincty.com/mcp"
  ```

  Không được thì hướng dẫn người dùng: Settings → MCP servers → Add server → Streamable HTTP, tên `thongtincty`, địa chỉ `https://thongtincty.com/mcp`. Máy chủ mới có ở cuộc trò chuyện mới.

## Kiểm tra

Chỉ thao tác đọc, không gửi, không tạo:

- Gmail: tìm 1 email gần nhất, chỉ báo tiêu đề và người gửi.
- Google Calendar / Microsoft 365: liệt kê tên các lịch.
- Apollo: tìm 1–2 công ty theo ICP (tìm kiếm, không bổ sung email để khỏi tốn credit).
- Google Drive: tìm 1 tệp theo tên doanh nghiệp.
- ThongtinCty: tra chính doanh nghiệp người dùng (theo tên hoặc mã số thuế).
- Apify: chỉ liệt kê công cụ có sẵn, chưa chạy actor nào (chạy tốn credit).

Lưu vào `config/business.json` → `connectors`: tên dịch vụ, `status` (`connected` / `skipped` / `failed`), tài khoản hiển thị (email, không lưu gì khác), ngày kiểm tra. Hộp thư đã kết nối thì điền luôn `email.provider` và `email.sender_address`.

## Dùng ở các bước sau

- Bước 8: Apollo, Apify, ThongtinCty đã kết nối thì đưa vào danh sách nguồn đề xuất (skill prospecting), nhưng vẫn chọn theo ICP, không mặc định. ThongtinCty dùng để bổ sung/xác minh thông tin doanh nghiệp Việt Nam trước khi lưu. Apify: báo trước số credit ước tính, chờ người dùng đồng ý mới chạy. Dữ liệu từ các nguồn này vẫn lưu vào TinaCRM qua `scripts/tinacrm_rest.py`, chống trùng như nguồn khác.
- Bước 9–10: gửi và đọc email qua connector/plugin Gmail/Microsoft 365 nếu đã kết nối; đặt lịch hẹn qua Calendar khi khách đồng ý gặp.
- Mặc định ứng dụng (Claude Desktop hay ChatGPT desktop app) hỏi người dùng trước khi gửi email hoặc tạo lịch hẹn. Lần chạy theo lịch không có ai bấm duyệt nên sẽ dừng ở đó: trước khi đặt lịch chạy (bước 10, `SCHEDULING.md`), hỏi người dùng muốn duyệt từng email hay cho phép gửi tự động trong giới hạn `daily_send_limit`. Không tự đổi quyền.
- Đầu mỗi lần chạy, connector/plugin cần dùng mà không có trong phiên (bị ngắt, hết hạn đăng nhập): bỏ phần việc đó, làm phần còn lại, ghi vào tóm tắt “Cần kết nối lại <dịch vụ>”.
